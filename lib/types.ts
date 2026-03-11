export interface InputData {
  revenue: number              // 売上高
  expenses: number             // 経費合計（専従者給与除く）
  blueFormDeduction: number    // 青色申告特別控除 (0 / 100000 / 550000 / 650000)
  familyWorkerSalary: number   // 専従者給与
  hasSpouse: boolean           // 配偶者あり
  dependents: number           // 扶養家族数（配偶者除く）
  ideco: number                // iDeCo・小規模企業共済等掛金
  age: number                  // 年齢（40歳以上で介護保険加算）
  directorSalary: number       // 法人化後に希望する役員報酬
  industryTaxRate: number      // 個人事業税率 (0.03 / 0.04 / 0.05)
}

export interface IndividualResult {
  businessIncome: number
  taxableIncome: number
  incomeTax: number
  residentTax: number
  businessTax: number
  nhi: number                  // 国民健康保険
  pension: number              // 国民年金
  socialInsurance: number      // nhi + pension
  total: number
}

export interface CorporateResult {
  director: {
    salary: number
    employmentIncome: number
    taxableIncome: number
    incomeTax: number
    residentTax: number
    socialInsurance: number    // 社保（従業員負担分）
    total: number
  }
  corporate: {
    income: number
    corporateTax: number
    residentTax: number
    businessTax: number
    total: number
  }
  socialInsuranceEmployer: number  // 社保（会社負担分）
  totalBurden: number              // 全体の税・社保負担合計
}

export type Verdict = 'incorporate' | 'consider' | 'not_yet'

export interface ComparisonResult {
  individual: IndividualResult
  corporation: CorporateResult
  savings: number              // 節税効果（プラスなら法人有利）
  verdict: Verdict
  breakEvenYears: number       // 設立コスト回収年数
}
