import { InputData, IndividualResult, CorporateResult, ComparisonResult } from './types'

// 所得税（累進課税）
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  const brackets = [
    { limit: 1_950_000,  rate: 0.05, deduction: 0 },
    { limit: 3_300_000,  rate: 0.10, deduction: 97_500 },
    { limit: 6_950_000,  rate: 0.20, deduction: 427_500 },
    { limit: 9_000_000,  rate: 0.23, deduction: 636_000 },
    { limit: 18_000_000, rate: 0.33, deduction: 1_536_000 },
    { limit: 40_000_000, rate: 0.40, deduction: 2_796_000 },
    { limit: Infinity,   rate: 0.45, deduction: 4_796_000 },
  ]
  for (const b of brackets) {
    if (taxableIncome <= b.limit) {
      return Math.max(0, Math.floor(taxableIncome * b.rate - b.deduction))
    }
  }
  return 0
}

// 給与所得控除
function calcSalaryDeduction(salary: number): number {
  if (salary <= 1_625_000) return 550_000
  if (salary <= 1_800_000) return Math.floor(salary * 0.4) - 100_000
  if (salary <= 3_600_000) return Math.floor(salary * 0.3) + 80_000
  if (salary <= 6_600_000) return Math.floor(salary * 0.2) + 440_000
  if (salary <= 8_500_000) return Math.floor(salary * 0.1) + 1_100_000
  return 1_950_000
}

// 標準報酬月額（厚生年金・健康保険の等級ベース）
function calcStandardMonthly(annualSalary: number): number {
  const monthly = annualSalary / 12
  return Math.min(Math.ceil(monthly / 1000) * 1000, 650_000)
}

// ===== 個人事業主の税金計算 =====
export function calcIndividual(input: InputData): IndividualResult {
  const businessIncome = Math.max(
    0,
    input.revenue - input.expenses - input.blueFormDeduction - input.familyWorkerSalary
  )

  const basicDeduction     = 480_000
  const spouseDeduction    = input.hasSpouse ? 380_000 : 0
  const dependentDeduction = input.dependents * 380_000

  const taxableIncome = Math.max(
    0,
    businessIncome
      - basicDeduction
      - spouseDeduction
      - dependentDeduction
      - input.ideco
      - input.medicalExpenses
      - input.lifeInsuranceDeduction
      - input.earthquakeInsurance
      - input.donationDeduction
  )

  // 所得税（復興特別所得税 2.1% 込み）住宅ローン控除は税額から直接控除
  const incomeTaxBase = Math.floor(calcIncomeTax(taxableIncome) * 1.021)
  const incomeTax = Math.max(0, incomeTaxBase - input.mortgageDeduction)

  // 住民税（所得割 10% + 均等割 5,000円）
  const residentTax = Math.floor(taxableIncome * 0.10) + 5_000

  // 個人事業税（事業主控除 290万円）
  const businessTaxBase = Math.max(0, businessIncome - 2_900_000)
  const businessTax = Math.floor(businessTaxBase * input.industryTaxRate)

  // 国民健康保険（全国平均ベースの簡易計算）
  const nhiBase = Math.max(0, businessIncome - 430_000)
  const nhiMedical  = Math.min(Math.floor(nhiBase * 0.0756) + 22_080, 870_000)
  const nhiSupport  = Math.min(Math.floor(nhiBase * 0.0240) + 8_760,  240_000)
  const nhiCare     = input.age >= 40
    ? Math.min(Math.floor(nhiBase * 0.0200) + 5_400, 170_000)
    : 0
  const nhi = nhiMedical + nhiSupport + nhiCare

  // 国民年金（2024年度: 16,980円/月）
  const pension = 16_980 * 12

  return {
    businessIncome,
    taxableIncome,
    incomeTax,
    residentTax,
    businessTax,
    nhi,
    pension,
    socialInsurance: nhi + pension,
    total: incomeTax + residentTax + businessTax + nhi + pension,
  }
}

// ===== 法人化後の税金計算 =====
export function calcCorporate(input: InputData): CorporateResult {
  const { directorSalary: salary } = input

  // ── 代表者（役員）の計算 ──
  const salaryDeduction  = calcSalaryDeduction(salary)
  const employmentIncome = Math.max(0, salary - salaryDeduction)

  // 社会保険（協会けんぽ 東京 2024年度）
  const stdMonthly = calcStandardMonthly(salary)
  const healthEmployee  = Math.floor(stdMonthly * 12 * 0.0499)
  const pensionEmployee = Math.floor(stdMonthly * 12 * 0.0915)
  const socialInsEmployee = healthEmployee + pensionEmployee

  const healthEmployer    = Math.floor(stdMonthly * 12 * 0.0499)
  const pensionEmployer   = Math.floor(stdMonthly * 12 * 0.0915)
  const childcareEmployer = Math.floor(stdMonthly * 12 * 0.0036)
  const socialInsEmployer = healthEmployer + pensionEmployer + childcareEmployer

  // 配偶者役員がいる場合、代表者の配偶者控除は不適用
  const spouseDeduction    = (input.hasSpouse && input.spouseDirectorSalary === 0) ? 380_000 : 0
  const dependentDeduction = input.dependents * 380_000
  const basicDeduction     = 480_000

  const directorTaxable = Math.max(
    0,
    employmentIncome
      - basicDeduction
      - spouseDeduction
      - dependentDeduction
      - input.ideco
      - socialInsEmployee
      - input.lifeInsuranceDeduction
      - input.earthquakeInsurance
      - input.medicalExpenses
      - input.donationDeduction
  )

  const directorIncomeTaxBase = Math.floor(calcIncomeTax(directorTaxable) * 1.021)
  const directorIncomeTax  = Math.max(0, directorIncomeTaxBase - input.mortgageDeduction)
  const directorResidentTax = Math.floor(directorTaxable * 0.10) + 5_000
  const directorTotal = directorIncomeTax + directorResidentTax + socialInsEmployee

  // ── 配偶者役員の計算（設定した場合のみ）──
  let spouseDirector: CorporateResult['spouseDirector'] = null
  let socialInsSpouseEmployer = 0

  if (input.spouseDirectorSalary > 0) {
    const spouseStdMonthly = calcStandardMonthly(input.spouseDirectorSalary)
    const spouseHealthEmp   = Math.floor(spouseStdMonthly * 12 * 0.0499)
    const spousePensionEmp  = Math.floor(spouseStdMonthly * 12 * 0.0915)
    const spouseInsEmployee = spouseHealthEmp + spousePensionEmp

    const spouseHealthEr     = Math.floor(spouseStdMonthly * 12 * 0.0499)
    const spousePensionEr    = Math.floor(spouseStdMonthly * 12 * 0.0915)
    const spouseChildcareEr  = Math.floor(spouseStdMonthly * 12 * 0.0036)
    socialInsSpouseEmployer  = spouseHealthEr + spousePensionEr + spouseChildcareEr

    const spouseSalDed      = calcSalaryDeduction(input.spouseDirectorSalary)
    const spouseEmpIncome   = Math.max(0, input.spouseDirectorSalary - spouseSalDed)
    const spouseTaxable     = Math.max(0, spouseEmpIncome - 480_000 - spouseInsEmployee)
    const spouseIncomeTax   = Math.max(0, Math.floor(calcIncomeTax(spouseTaxable) * 1.021))
    const spouseResidentTax = Math.floor(spouseTaxable * 0.10) + 5_000
    const spouseTotal = spouseIncomeTax + spouseResidentTax + spouseInsEmployee

    spouseDirector = {
      salary: input.spouseDirectorSalary,
      incomeTax: spouseIncomeTax,
      residentTax: spouseResidentTax,
      socialInsurance: spouseInsEmployee,
      total: spouseTotal,
    }
  }

  // ── 法人の課税所得 ──
  const corporateIncome = Math.max(
    0,
    input.revenue
      - input.expenses
      - salary
      - socialInsEmployer
      - (spouseDirector ? input.spouseDirectorSalary : 0)
      - socialInsSpouseEmployer
  )

  // 法人税（中小法人 資本金1億円以下）
  let nationalTax = 0
  if (corporateIncome > 0) {
    if (corporateIncome <= 8_000_000) {
      nationalTax = Math.floor(corporateIncome * 0.15)
    } else {
      nationalTax = Math.floor(8_000_000 * 0.15 + (corporateIncome - 8_000_000) * 0.232)
    }
  }

  // 地方法人税
  const localNationalTax = Math.floor(nationalTax * 0.103)

  // 法人住民税（法人税割 + 均等割）
  const residentTaxRatio    = Math.floor(nationalTax * 0.07)
  const fixedResidentTax    = 70_000
  const corporateResidentTax = residentTaxRatio + fixedResidentTax

  // 法人事業税
  let bizTax = 0
  if (corporateIncome > 0) {
    if (corporateIncome <= 4_000_000) {
      bizTax = Math.floor(corporateIncome * 0.035)
    } else if (corporateIncome <= 8_000_000) {
      bizTax = Math.floor(4_000_000 * 0.035 + (corporateIncome - 4_000_000) * 0.053)
    } else {
      bizTax = Math.floor(4_000_000 * 0.035 + 4_000_000 * 0.053 + (corporateIncome - 8_000_000) * 0.07)
    }
  }
  const specialBizTax = Math.floor(bizTax * 0.37)
  const corporateBusinessTax = bizTax + specialBizTax
  const corporateTaxTotal = nationalTax + localNationalTax + corporateResidentTax + corporateBusinessTax

  const totalBurden =
    directorTotal
    + corporateTaxTotal
    + socialInsEmployer
    + (spouseDirector ? spouseDirector.total + socialInsSpouseEmployer : 0)

  return {
    director: {
      salary,
      employmentIncome,
      taxableIncome: directorTaxable,
      incomeTax: directorIncomeTax,
      residentTax: directorResidentTax,
      socialInsurance: socialInsEmployee,
      total: directorTotal,
    },
    corporate: {
      income: corporateIncome,
      corporateTax: nationalTax + localNationalTax,
      residentTax: corporateResidentTax,
      businessTax: corporateBusinessTax,
      total: corporateTaxTotal,
    },
    spouseDirector,
    socialInsuranceEmployer: socialInsEmployer,
    socialInsuranceSpouseEmployer: socialInsSpouseEmployer,
    totalBurden,
  }
}

// ===== 比較・判定 =====
const INCORPORATION_COST = 250_000  // 法人設立費用の概算

// 法人化が有利になる事業所得の損益分岐点を二分探索で算出
function findTippingPoint(input: InputData): number | null {
  const fixedDeductions = input.expenses + input.blueFormDeduction + input.familyWorkerSalary

  // 上限: 事業所得 3,000万円 まで探索
  const maxBI = 30_000_000
  const maxRevenue = maxBI + fixedDeductions
  const maxSavings =
    calcIndividual({ ...input, revenue: maxRevenue }).total -
    calcCorporate({ ...input, revenue: maxRevenue }).totalBurden

  if (maxSavings < 0) return null // 3,000万円でも法人化が有利にならない

  let lo = input.revenue
  let hi = maxRevenue

  for (let i = 0; i < 60; i++) {
    const mid = Math.floor((lo + hi) / 2)
    const savings =
      calcIndividual({ ...input, revenue: mid }).total -
      calcCorporate({ ...input, revenue: mid }).totalBurden
    if (savings >= 0) {
      hi = mid
    } else {
      lo = mid
    }
    if (hi - lo < 10_000) break
  }

  // 事業所得に換算し、10万円単位で切り上げ
  const tippingBI = hi - fixedDeductions
  return Math.ceil(Math.max(0, tippingBI) / 100_000) * 100_000
}

export function compare(input: InputData): ComparisonResult {
  const individual  = calcIndividual(input)
  const corporation = calcCorporate(input)

  const savings = individual.total - corporation.totalBurden

  let verdict: ComparisonResult['verdict']
  if (savings >= 500_000) {
    verdict = 'incorporate'
  } else if (savings >= 0) {
    verdict = 'consider'
  } else {
    verdict = 'not_yet'
  }

  const breakEvenYears = savings > 0
    ? Math.ceil(INCORPORATION_COST / savings)
    : Infinity

  const tippingPointBusinessIncome =
    verdict === 'not_yet' ? findTippingPoint(input) ?? undefined : undefined

  return { individual, corporation, savings, verdict, breakEvenYears, tippingPointBusinessIncome }
}
