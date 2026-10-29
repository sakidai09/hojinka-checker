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

// ===== 2026年（令和8年）の前提値 =====
// 出典: 国税庁「源泉所得税の改正のあらまし（令和8年4月）」、日本年金機構（令和8年度保険料）、
//       協会けんぽ 令和8年度 都道府県単位保険料率（東京都）、新宿区 令和8年度国民健康保険料率
export const TAX_YEAR_LABEL = '2026年（令和8年）分'

export const NATIONAL_PENSION_MONTHLY = 17_920   // 国民年金 令和8年度

// 協会けんぽ 東京都 令和8年度（労使合計の率）
const KENPO_HEALTH_RATE    = 0.0985
const KENPO_CARE_RATE      = 0.0162 // 40〜64歳
const KENPO_CHILD_RATE     = 0.0023 // 子ども・子育て支援金（令和8年4月分〜）
const PENSION_RATE         = 0.183
const CHILD_CONTRIB_RATE   = 0.0036 // 子ども・子育て拠出金（全額会社負担）

// 国民健康保険（東京23区・新宿区 令和8年度）
const NHI = {
  medical: { rate: 0.0751, perCapita: 47_600, cap: 670_000 },
  support: { rate: 0.0280, perCapita: 17_600, cap: 260_000 },
  care:    { rate: 0.0243, perCapita: 17_800, cap: 170_000 },
  child:   { rate: 0.0027, perCapita: 1_873,  cap: 30_000 },
}
const RESIDENT_BASIC_DEDUCTION = 430_000

// 標準報酬月額の等級（千円）。健康保険は全50等級、厚生年金は88千円〜650千円
const HEALTH_GRADES = [
  58, 68, 78, 88, 98, 104, 110, 118, 126, 134, 142, 150, 160, 170, 180, 190, 200,
  220, 240, 260, 280, 300, 320, 340, 360, 380, 410, 440, 470, 500, 530, 560, 590,
  620, 650, 680, 710, 750, 790, 830, 880, 930, 980, 1030, 1090, 1150, 1210, 1270,
  1330, 1390,
].map(v => v * 1000)
const PENSION_GRADES = HEALTH_GRADES.filter(v => v >= 88_000 && v <= 650_000)

// 所得税の基礎控除（令和8・9年分）
function calcBasicDeduction(totalIncome: number): number {
  if (totalIncome <= 4_890_000)  return 1_040_000
  if (totalIncome <= 6_550_000)  return 670_000
  if (totalIncome <= 23_500_000) return 620_000
  if (totalIncome <= 24_000_000) return 480_000
  if (totalIncome <= 24_500_000) return 320_000
  if (totalIncome <= 25_000_000) return 160_000
  return 0
}

// 配偶者控除（所得税・住民税）。合計所得が多いほど逓減
function calcSpouseDeduction(totalIncome: number, forResident: boolean): number {
  if (totalIncome <= 9_000_000)  return forResident ? 330_000 : 380_000
  if (totalIncome <= 9_500_000)  return forResident ? 220_000 : 260_000
  if (totalIncome <= 10_000_000) return forResident ? 110_000 : 130_000
  return 0
}

// 給与所得控除（令和8年分: 最低保障額74万円）
function calcSalaryDeduction(salary: number): number {
  if (salary <= 3_600_000) return Math.max(740_000, Math.floor(salary * 0.3) + 80_000)
  if (salary <= 6_600_000) return Math.floor(salary * 0.2) + 440_000
  if (salary <= 8_500_000) return Math.floor(salary * 0.1) + 1_100_000
  return 1_950_000
}

// 標準報酬月額: 報酬月額に最も近い等級（境界は隣り合う等級の中間）
function toGrade(monthly: number, grades: number[]): number {
  for (let i = 0; i < grades.length - 1; i++) {
    if (monthly < (grades[i] + grades[i + 1]) / 2) return grades[i]
  }
  return grades[grades.length - 1]
}

const needsCareInsurance = (age: number) => age >= 40 && age < 65

// 役員1人分の社会保険料（本人負担・会社負担）
function calcEmployeeInsurance(annualSalary: number, age: number) {
  const monthly = annualSalary / 12
  const healthStd  = toGrade(monthly, HEALTH_GRADES)
  const pensionStd = toGrade(monthly, PENSION_GRADES)
  const healthRate = KENPO_HEALTH_RATE + KENPO_CHILD_RATE + (needsCareInsurance(age) ? KENPO_CARE_RATE : 0)

  const health  = Math.floor(healthStd * 12 * healthRate / 2)
  const pension = Math.floor(pensionStd * 12 * PENSION_RATE / 2)
  const childContribution = Math.floor(pensionStd * 12 * CHILD_CONTRIB_RATE)

  return {
    employee: health + pension,
    employer: health + pension + childContribution,
  }
}

// 所得税・住民税（給与・事業共通）
function calcPersonalTaxes(params: {
  totalIncome: number        // 合計所得金額
  otherDeductions: number    // 社会保険料・iDeCo・各種控除の合計
  spouse: boolean
  dependents: number
  mortgageDeduction: number
}) {
  const { totalIncome, otherDeductions, spouse, dependents, mortgageDeduction } = params

  const incomeTaxable = Math.max(
    0,
    totalIncome
      - calcBasicDeduction(totalIncome)
      - (spouse ? calcSpouseDeduction(totalIncome, false) : 0)
      - dependents * 380_000
      - otherDeductions
  )
  const residentTaxable = Math.max(
    0,
    totalIncome
      - (totalIncome <= 24_000_000 ? RESIDENT_BASIC_DEDUCTION : 0)
      - (spouse ? calcSpouseDeduction(totalIncome, true) : 0)
      - dependents * 330_000
      - otherDeductions
  )

  // 所得税（復興特別所得税 2.1% 込み）住宅ローン控除は税額から直接控除
  const incomeTax = Math.max(0, Math.floor(calcIncomeTax(incomeTaxable) * 1.021) - mortgageDeduction)
  // 住民税（所得割 10% + 均等割・森林環境税 5,000円）
  const residentTax = Math.floor(residentTaxable * 0.10) + 5_000

  return { incomeTaxable, incomeTax, residentTax }
}

// 国民健康保険（世帯単位）
function calcNHI(totalIncome: number, members: number, age: number): number {
  const base = Math.max(0, totalIncome - RESIDENT_BASIC_DEDUCTION)
  const part = (p: { rate: number; perCapita: number; cap: number }, n: number) =>
    Math.min(Math.floor(base * p.rate) + p.perCapita * n, p.cap)

  return (
    part(NHI.medical, members)
    + part(NHI.support, members)
    + (needsCareInsurance(age) ? part(NHI.care, 1) : 0)
    + part(NHI.child, 1)
  )
}

// ===== 個人事業主の税金計算 =====
export function calcIndividual(input: InputData): IndividualResult {
  const businessIncome = Math.max(
    0,
    input.revenue - input.expenses - input.blueFormDeduction - input.familyWorkerSalary
  )

  const householdMembers = 1 + (input.hasSpouse ? 1 : 0) + input.dependents
  const nhi = calcNHI(businessIncome, householdMembers, input.age)
  // 配偶者控除の対象となる配偶者は自分で国民年金（第1号）に加入する前提
  const pension = NATIONAL_PENSION_MONTHLY * 12 * (input.hasSpouse ? 2 : 1)
  const socialInsurance = nhi + pension

  const { incomeTaxable, incomeTax, residentTax } = calcPersonalTaxes({
    totalIncome: businessIncome,
    otherDeductions:
      socialInsurance
      + input.ideco
      + input.medicalExpenses
      + input.lifeInsuranceDeduction
      + input.earthquakeInsurance
      + input.donationDeduction,
    spouse: input.hasSpouse,
    dependents: input.dependents,
    mortgageDeduction: input.mortgageDeduction,
  })

  // 個人事業税（事業主控除 290万円）
  const businessTaxBase = Math.max(0, businessIncome - 2_900_000)
  const businessTax = Math.floor(businessTaxBase * input.industryTaxRate)

  return {
    businessIncome,
    taxableIncome: incomeTaxable,
    incomeTax,
    residentTax,
    businessTax,
    nhi,
    pension,
    socialInsurance,
    total: incomeTax + residentTax + businessTax + socialInsurance,
  }
}

// ===== 法人化後の税金計算 =====
export function calcCorporate(input: InputData): CorporateResult {
  const { directorSalary: salary } = input

  // ── 代表者（役員）の計算 ──
  const employmentIncome = Math.max(0, salary - calcSalaryDeduction(salary))
  const directorIns = salary > 0
    ? calcEmployeeInsurance(salary, input.age)
    : { employee: 0, employer: 0 }
  const socialInsEmployee = directorIns.employee
  const socialInsEmployer = directorIns.employer

  // 配偶者役員がいない場合、配偶者は代表者の健康保険の扶養・第3号被保険者とする
  const hasSpouseDeduction = input.hasSpouse && input.spouseDirectorSalary === 0

  const directorTaxes = calcPersonalTaxes({
    totalIncome: employmentIncome,
    otherDeductions:
      socialInsEmployee
      + input.ideco
      + input.lifeInsuranceDeduction
      + input.earthquakeInsurance
      + input.medicalExpenses
      + input.donationDeduction,
    spouse: hasSpouseDeduction,
    dependents: input.dependents,
    mortgageDeduction: input.mortgageDeduction,
  })
  const directorTotal = directorTaxes.incomeTax + directorTaxes.residentTax + socialInsEmployee

  // ── 配偶者役員の計算（設定した場合のみ。年齢は代表者と同じ区分と仮定）──
  let spouseDirector: CorporateResult['spouseDirector'] = null
  let socialInsSpouseEmployer = 0

  if (input.spouseDirectorSalary > 0) {
    const spouseIns = calcEmployeeInsurance(input.spouseDirectorSalary, input.age)
    socialInsSpouseEmployer = spouseIns.employer

    const spouseEmpIncome = Math.max(0, input.spouseDirectorSalary - calcSalaryDeduction(input.spouseDirectorSalary))
    const spouseTaxes = calcPersonalTaxes({
      totalIncome: spouseEmpIncome,
      otherDeductions: spouseIns.employee,
      spouse: false,
      dependents: 0,
      mortgageDeduction: 0,
    })

    spouseDirector = {
      salary: input.spouseDirectorSalary,
      incomeTax: spouseTaxes.incomeTax,
      residentTax: spouseTaxes.residentTax,
      socialInsurance: spouseIns.employee,
      total: spouseTaxes.incomeTax + spouseTaxes.residentTax + spouseIns.employee,
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
      taxableIncome: directorTaxes.incomeTaxable,
      incomeTax: directorTaxes.incomeTax,
      residentTax: directorTaxes.residentTax,
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
