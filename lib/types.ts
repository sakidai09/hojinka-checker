export interface InputData {
  revenue: number              // 売上高
  expenses: number             // 経費合計（専従者給与除く）
  blueFormDeduction: number    // 青色申告特別控除 (0 / 100000 / 550000 / 650000)
  familyWorkerSalary: number   // 専従者給与
  hasSpouse: boolean           // 配偶者あり
  dependents: number           // 扶養家族数（配偶者除く）
  ideco: number                // iDeCo・小規模企業共済等掛金
  age: number                  // 年齢（40歳以上で介護保険加算）
  directorSalary: number       // 法人化後に希望する役員報酬（代表者）
  industryTaxRate: number      // 個人事業税率 (0.03 / 0.04 / 0.05)
  // 追加控除（詳細設定アコーディオン）
  mortgageDeduction: number    // 住宅ローン控除（税額控除・年間額）
  medicalExpenses: number      // 医療費控除（10万円超の部分）
  lifeInsuranceDeduction: number // 生命保険料控除（最大12万円）
  earthquakeInsurance: number  // 地震保険料控除（最大5万円）
  donationDeduction: number    // 寄附金控除（ふるさと納税等・寄付金 − 2,000円）
  // 法人化後の詳細設定
  spouseDirectorSalary: number // 配偶者役員報酬（年額・0なら設定なし）
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
  spouseDirector: {            // 配偶者役員（設定した場合のみ）
    salary: number
    incomeTax: number
    residentTax: number
    socialInsurance: number
    total: number
  } | null
  socialInsuranceEmployer: number  // 社保（会社負担分・代表者分）
  socialInsuranceSpouseEmployer: number // 社保（会社負担分・配偶者分）
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
