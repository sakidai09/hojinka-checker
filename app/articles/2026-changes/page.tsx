import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedArticles from '@/components/RelatedArticles'
import { getArticle } from '@/lib/articles'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '2026年（令和8年）の税制・社会保険の変更点と法人化への影響 | 法人化シミュレーター',
  description:
    '令和8年度税制改正による所得税の基礎控除・給与所得控除の引上げ、国民年金保険料、協会けんぽの料率、国民健康保険の子ども・子育て支援金分の新設などを整理し、個人事業主と法人（マイクロ法人）の比較にどう効くかを計算例つきで解説します。',
}

const thHead = 'border border-gray-300 px-3 py-2 text-left'
const th = 'border border-gray-300 bg-gray-50 px-3 py-2 text-left'
const td = 'border border-gray-300 px-3 py-2'

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">{children}</h2>
}

function Calc({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs leading-relaxed space-y-1">
      {children}
    </div>
  )
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
      {children}
    </a>
  )
}

export default function Changes2026Article() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Breadcrumbs items={[{ name: '記事一覧', href: '/articles' }, { name: getArticle('2026-changes')!.title, href: '/articles/2026-changes' }]} />
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 text-gray-800 text-sm leading-relaxed">
          <h1 className="text-xl font-bold text-gray-900">
            2026年（令和8年）の税制・社会保険の変更点と法人化への影響
          </h1>
          <p className="text-xs text-gray-500">
            最終更新日: 2026年10月29日 ／
            <Link href="/calculation-policy" className="text-blue-600 hover:underline ml-1">
              シミュレーターの計算根拠
            </Link>
          </p>

          <p>
            2026年は、所得税の基礎控除と給与所得控除の引上げ、国民年金保険料の改定、協会けんぽの料率変更、そして医療保険に上乗せされる「子ども・子育て支援金」の開始が重なった年です。どれも個人事業主と法人の比較に関係しますが、効き方は人によって逆向きになることもあります。
          </p>
          <p>
            この記事では、2026年に法人化を検討している個人事業主の方に向けて、変更点を一つずつ取り上げ、「個人のまま」と「法人化（役員報酬を受け取る）」のどちらに有利に働くのかを、実際に数字を当てはめて確認します。
          </p>

          <section>
            <H2>先に結論</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                所得税の基礎控除は、合計所得金額489万円以下の人で最大104万円まで上がりました（令和8・9年分の特例）。所得が低〜中位の個人事業主は個人のままの税負担が下がるため、
                <strong>法人化の損益分岐点はやや上に動く方向</strong>です。
              </li>
              <li>
                給与所得控除の最低保障額74万円は役員報酬にだけ効くため、役員報酬を低く抑えるマイクロ法人では小さなプラスになります。ただし金額は数千円〜数万円程度です。
              </li>
              <li>
                住民税の基礎控除は43万円のまま、国民健康保険の計算も「所得−43万円」のままです。所得税の改正だけを見て判断すると、効果を大きく見積もりすぎます。
              </li>
              <li>
                子ども・子育て支援金は国保・健保の両方に上乗せされるため、個人と法人の差はほとんど動きません。
              </li>
              <li>
                基礎控除の上乗せ部分は令和8・9年分の時限措置です。法人化は何年も続く選択なので、2年間の特例だけで決めないことが大切です。
              </li>
            </ul>
          </section>

          <section>
            <H2>2026年の主な変更点一覧</H2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>項目</th>
                    <th className={thHead}>変更内容</th>
                    <th className={thHead}>主に効く側</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`${td} font-medium`}>所得税の基礎控除</td>
                    <td className={td}>合計所得489万円以下で104万円など（令和8年分から）</td>
                    <td className={td}>個人・法人代表者の両方</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>給与所得控除</td>
                    <td className={td}>最低保障額 65万円→74万円（令和8・9年分）</td>
                    <td className={td}>法人代表者（役員報酬）</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>扶養の所得要件</td>
                    <td className={td}>58万円以下→62万円以下</td>
                    <td className={td}>家族を雇う場合など</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>住民税の基礎控除</td>
                    <td className={td}>43万円で据え置き</td>
                    <td className={td}>（変化なし）</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>国民年金保険料</td>
                    <td className={td}>月17,510円→17,920円（令和8年度）</td>
                    <td className={td}>個人</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>協会けんぽ（東京都）</td>
                    <td className={td}>健康保険9.91%→9.85%、介護1.59%→1.62%、支援金0.23%新設</td>
                    <td className={td}>法人</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>国民健康保険（新宿区の例）</td>
                    <td className={td}>子ども・子育て支援金分を新設、合計上限109万円→113万円</td>
                    <td className={td}>個人</td>
                  </tr>
                  <tr>
                    <td className={`${td} font-medium`}>防衛特別法人税</td>
                    <td className={td}>令和8年4月1日以後開始の事業年度から</td>
                    <td className={td}>法人（多くの中小法人は実質影響なし）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <H2>1. 所得税の基礎控除の引上げ</H2>
            <p>
              令和8年度税制改正で、所得税の基礎控除が引き上げられました。施行は原則として令和8年12月1日ですが、
              <strong>令和8年分（2026年1月〜12月の所得）から適用</strong>されます。個人事業主であれば、2027年に行う令和8年分の確定申告で新しい控除額を使うことになります。
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>合計所得金額</th>
                    <th className={thHead}>改正前</th>
                    <th className={thHead}>改正後（令和8・9年分）</th>
                    <th className={thHead}>差</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>132万円以下</td>
                    <td className={td}>95万円</td>
                    <td className={td}>104万円</td>
                    <td className={td}>+9万円</td>
                  </tr>
                  <tr>
                    <td className={td}>132万円超336万円以下</td>
                    <td className={td}>88万円</td>
                    <td className={td}>104万円</td>
                    <td className={td}>+16万円</td>
                  </tr>
                  <tr>
                    <td className={td}>336万円超489万円以下</td>
                    <td className={td}>68万円</td>
                    <td className={td}>104万円</td>
                    <td className={td}>+36万円</td>
                  </tr>
                  <tr>
                    <td className={td}>489万円超655万円以下</td>
                    <td className={td}>63万円</td>
                    <td className={td}>67万円</td>
                    <td className={td}>+4万円</td>
                  </tr>
                  <tr>
                    <td className={td}>655万円超2,350万円以下</td>
                    <td className={td}>58万円</td>
                    <td className={td}>62万円</td>
                    <td className={td}>+4万円</td>
                  </tr>
                  <tr>
                    <td className={td}>2,350万円超</td>
                    <td className={td} colSpan={3}>改正なし</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              ※改正前は令和7年改正後の令和8年分の金額。104万円は本則62万円＋加算42万円で、加算は居住者のみが対象です。令和10年分以後は、132万円以下が99万円、それ以外（2,350万円以下）が62万円になる予定です。
            </p>

            <h3 className="font-bold text-gray-900 mt-4 mb-1">計算例：所得450万円の個人事業主</h3>
            <p>
              青色申告特別控除後の所得が450万円、40歳未満、東京都新宿区在住の1人世帯の個人事業主で考えます（社会保険料控除以外の控除は無視した簡易モデルです）。
            </p>
            <Calc>
              <p>国民年金：17,920円 × 12か月 ＝ 215,040円</p>
              <p>国民健康保険（後述の新宿区の料率で計算）：約497,700円</p>
              <p>改正前の課税所得：450万 − 21.5万 − 49.8万 − 68万 ＝ 約310.7万円</p>
              <p>改正後の課税所得：450万 − 21.5万 − 49.8万 − 104万 ＝ 約274.7万円</p>
              <p>課税所得の減少：36万円</p>
              <p>所得税の減少：限界税率を10%と仮定すると 36万 × 10% ＝ 3.6万円（20%と仮定すれば7.2万円）</p>
            </Calc>
            <p className="mt-2">
              一方、同じ人が法人化して役員報酬を年180万円に抑えた場合、もともと所得税がほぼかからない水準なので、基礎控除が増えても所得税はほとんど減りません（詳しくは次の章で計算します）。つまり
              <strong>この改正の恩恵は「個人のまま」の側に大きく出る</strong>ため、法人化による節税額は以前より小さくなります。
            </p>

            <h3 className="font-bold text-gray-900 mt-4 mb-1">注意点：489万円の境目</h3>
            <p>
              合計所得金額が489万円以下なら104万円、1円でも超えると67万円です。所得489万円の人と490万円の人では、所得は1万円しか違わないのに基礎控除は37万円違います。所得が489万〜655万円の個人事業主の場合、法人化して役員報酬を低めに設定し、本人の合計所得金額を489万円以下に収めると、基礎控除が67万円から104万円に増えます。ただし、これは令和8・9年分の2年間の特例です。この効果だけを理由に法人化すると、令和10年分以後に前提が崩れます。
            </p>
          </section>

          <section>
            <H2>2. 給与所得控除の最低保障額の引上げ</H2>
            <p>
              給与所得控除の最低保障額が65万円から74万円に引き上げられました（令和8・9年分）。国税庁の資料によると、令和8・9年分は給与収入が74万1,000円以上219万1,000円未満の範囲で「給与所得＝収入−74万円」とされています。給与収入220万円超の部分には改正がありません。令和10年分以後の最低保障額は69万円の予定です。
            </p>
            <p className="mt-2">
              給与所得控除は給与を受け取る人だけの控除なので、
              <strong>個人事業主には関係がなく、法人から役員報酬を受け取る代表者にだけ効きます</strong>。役員報酬を低めに設定するマイクロ法人で特に関係します。
            </p>
            <h3 className="font-bold text-gray-900 mt-4 mb-1">計算例：役員報酬 年180万円（月15万円）</h3>
            <Calc>
              <p>改正前の給与所得：180万 − 65万 ＝ 115万円</p>
              <p>改正後の給与所得：180万 − 74万 ＝ 106万円（9万円減）</p>
              <p>
                本人の社会保険料（東京都・40歳未満、健康保険と支援金と厚生年金の本人負担 14.19%）：180万 × 14.19% ＝ 約25.5万円
              </p>
              <p>所得税の課税所得：106万 − 25.5万 − 104万 ＝ マイナス → 0円（改正前も 115万 − 25.4万 − 95万 ＝ マイナス → 0円）</p>
              <p>住民税の課税所得：106万 − 25.5万 − 43万 ＝ 約37.5万円（改正前ルールなら約46.6万円）</p>
              <p>住民税の減少：約9万円 × 10%（所得割の税率を10%と仮定）＝ 約9,000円</p>
            </Calc>
            <p className="mt-2">
              この水準の役員報酬では、所得税はもともとゼロのため、効果は住民税の約9,000円にとどまります。住民税は前年の所得で計算されるため、令和8年の給与に対する効果は令和9年度の住民税（2027年6月ごろからの納付分）に出ます。
            </p>
            <h3 className="font-bold text-gray-900 mt-4 mb-1">家族を雇う場合の扶養要件</h3>
            <p>
              扶養親族・同一生計配偶者の所得要件も58万円以下から62万円以下に上がりました。給与収入だけなら、62万円＋給与所得控除74万円＝136万円以下が目安です。配偶者特別控除の対象は、配偶者の合計所得金額が62万円超133万円以下の範囲です。法人化して家族に給与を支払う設計をする場合は、この線を意識しておくと計算しやすくなります。
            </p>
          </section>

          <section>
            <H2>3. 住民税の基礎控除は据え置き</H2>
            <p>
              京都市の市会資料によると、個人住民税の基礎控除は43万円のまま据え置かれています。一方で、給与所得控除の最低保障額は住民税にも反映され、令和8年度課税（令和7年の所得）では65万円、令和9年度課税（令和8年の所得）では74万円となります。
            </p>
            <p className="mt-2">
              この結果、所得税と住民税の基礎控除の差が広がります。所得336万〜489万円の層では、改正前は 68万 − 43万 ＝ 25万円だった差が、改正後は 104万 − 43万 ＝ 61万円になります。「所得税はゼロ、または少額なのに、住民税はそれなりにかかる」という状態が起きやすくなります。
            </p>
            <p className="mt-2">
              また、国民健康保険料の所得割も「前年の総所得金額等−43万円」で計算するため、所得税の基礎控除の引上げは国保料を下げません。法人化の比較では、所得税の減少だけを見て「個人のままでも十分安くなった」と判断しないよう注意が必要です。
            </p>
          </section>

          <section>
            <H2>4. 国民年金保険料の改定</H2>
            <p>
              令和8年度の国民年金保険料は月額17,920円で、令和7年度の17,510円から410円上がりました。
            </p>
            <Calc>
              <p>令和7年度：17,510円 × 12 ＝ 210,120円</p>
              <p>令和8年度：17,920円 × 12 ＝ 215,040円</p>
              <p>年間の増加額：215,040円 − 210,120円 ＝ 4,920円</p>
              <p>令和9年度（予定）：18,290円 × 12 ＝ 219,480円</p>
            </Calc>
            <p className="mt-2">
              国民年金は所得に関係なく定額のため、個人のままでいる人の固定費が年4,920円増えることになります。法人化して厚生年金に加入すると国民年金保険料はかからなくなる（厚生年金保険料に置き換わる）ため、ごくわずかに法人側に有利な変化です。
            </p>
          </section>

          <section>
            <H2>5. 協会けんぽの料率変更と子ども・子育て支援金</H2>
            <p>
              法人化すると、役員報酬にかかる社会保険は協会けんぽ（健康保険）と厚生年金になります。東京都の健康保険料率は9.91%から9.85%に下がり、40〜64歳が負担する介護保険料率（全国一律）は1.59%から1.62%に上がりました（令和8年3月分から）。さらに令和8年4月分から、子ども・子育て支援金率0.23%（全国一律、労使折半）が新たに加わりました。厚生年金保険料率18.3%は変わりません。
            </p>
            <Calc>
              <p>40歳未満：改正前 9.91% ＋ 18.3% ＝ 28.21% → 改正後 9.85% ＋ 0.23% ＋ 18.3% ＝ 28.38%（＋0.17ポイント）</p>
              <p>40〜64歳：改正前 9.91% ＋ 1.59% ＋ 18.3% ＝ 29.80% → 改正後 9.85% ＋ 1.62% ＋ 0.23% ＋ 18.3% ＝ 30.00%（＋0.20ポイント）</p>
              <p>役員報酬 年180万円の場合（労使合計・年額換算）：40歳未満 180万 × 0.17% ＝ 3,060円増、40〜64歳 180万 × 0.20% ＝ 3,600円増</p>
            </Calc>
            <p className="mt-2 text-xs text-gray-600">
              ※実際の保険料は標準報酬月額の等級で計算されます。ここでは報酬額にそのまま料率を掛けた簡易計算です。
            </p>
            <p className="mt-2">
              マイクロ法人では会社負担分も本人負担分も同じ財布から出るため、労使合計で見るのが実態に近くなります。とはいえ、役員報酬180万円で年3,000円台の増加なので、法人化の判断を左右するほどの変化ではありません。
            </p>
          </section>

          <section>
            <H2>6. 国民健康保険：支援金分の新設と上限113万円</H2>
            <p>
              国民健康保険料は市区町村ごとに料率が違います。ここでは東京23区の例として、新宿区の令和8年度の料率を使います。
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>区分</th>
                    <th className={thHead}>所得割</th>
                    <th className={thHead}>均等割</th>
                    <th className={thHead}>上限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className={th}>医療分</th>
                    <td className={td}>7.51%</td>
                    <td className={td}>47,600円</td>
                    <td className={td}>67万円</td>
                  </tr>
                  <tr>
                    <th className={th}>後期高齢者支援金分</th>
                    <td className={td}>2.80%</td>
                    <td className={td}>17,600円</td>
                    <td className={td}>26万円</td>
                  </tr>
                  <tr>
                    <th className={th}>介護分（40〜64歳）</th>
                    <td className={td}>2.43%</td>
                    <td className={td}>17,800円</td>
                    <td className={td}>17万円</td>
                  </tr>
                  <tr>
                    <th className={th}>子ども・子育て支援金分（新設）</th>
                    <td className={td}>0.27%</td>
                    <td className={td}>1,873円（18歳以上）</td>
                    <td className={td}>3万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              ※所得割の算定基礎額＝前年の総所得金額等−43万円。合計の上限は113万円（前年は109万円）。
            </p>

            <h3 className="font-bold text-gray-900 mt-4 mb-1">計算例（1人世帯・所得割と均等割のみの簡易計算）</h3>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>所得</th>
                    <th className={thHead}>うち支援金分</th>
                    <th className={thHead}>合計（40歳未満）</th>
                    <th className={thHead}>合計（40〜64歳）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>300万円</td>
                    <td className={td}>約8,800円</td>
                    <td className={td}>約33.9万円</td>
                    <td className={td}>約41.9万円</td>
                  </tr>
                  <tr>
                    <td className={td}>500万円</td>
                    <td className={td}>約14,200円</td>
                    <td className={td}>約55.1万円</td>
                    <td className={td}>約67.9万円</td>
                  </tr>
                  <tr>
                    <td className={td}>800万円</td>
                    <td className={td}>約22,300円</td>
                    <td className={td}>約86.8万円</td>
                    <td className={td}>約103.8万円</td>
                  </tr>
                  <tr>
                    <td className={td}>1,200万円</td>
                    <td className={td}>3万円（上限）</td>
                    <td className={td}>96万円（上限）</td>
                    <td className={td}>113万円（上限）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Calc>
              <p>所得500万円の支援金分：(500万 − 43万) × 0.27% ＋ 1,873円 ＝ 12,339円 ＋ 1,873円 ＝ 14,212円</p>
              <p>医療分が上限67万円に達する所得：(67万 − 4.76万) ÷ 7.51% ＋ 43万 ＝ 約872万円</p>
              <p>支援金分が上限3万円に達する所得：(3万 − 0.1873万) ÷ 0.27% ＋ 43万 ＝ 約1,085万円</p>
            </Calc>

            <h3 className="font-bold text-gray-900 mt-4 mb-1">支援金は「両方にかかる」ので差は小さい</h3>
            <p>
              子ども・子育て支援金は、個人なら国保に、法人なら健康保険に上乗せされます。所得500万円の個人事業主の国保支援金分は約14,200円です。法人化して役員報酬を300万円にした場合の健康保険の支援金は 300万 × 0.23% ＝ 6,900円（労使合計、本人負担はその半分の3,450円）です。どちらを選んでも負担が発生するため、個人と法人の差は数千円単位にとどまります。
            </p>

            <h3 className="font-bold text-gray-900 mt-4 mb-1">高所得になるほど国保は頭打ち、健保は比例</h3>
            <p>
              国保には合計113万円（40〜64歳の場合）の上限があり、所得が増えてもそれ以上は上がりません。一方、健康保険は報酬に比例します。たとえば年1,200万円を役員報酬として全額受け取ると、40〜64歳では 1,200万 × (9.85% ＋ 1.62% ＋ 0.23%) ＝ 1,200万 × 11.70% ＝ 140.4万円（労使合計）となり、国保の上限113万円を上回ります（健康保険にも標準報酬月額の上限がありますが、ここでは考慮していません）。さらに厚生年金保険料も加わります。
            </p>
            <p className="mt-2">
              このため高所得の個人事業主が法人化する場合、「利益を全部役員報酬で受け取る」設計では社会保険料が増えやすく、役員報酬をどの水準に設定するかが比較の要になります。
            </p>
          </section>

          <section>
            <H2>7. 変更点をまとめて当てはめた簡易試算</H2>
            <p>
              第1章の「所得450万円・40歳未満・新宿区」の個人事業主について、2026年の変更点が「個人のまま」と「法人化（役員報酬180万円、残りは法人に残す）」のそれぞれにどう効くかを並べます。法人税・法人住民税・事業税などの変わらない項目や、国保の医療分・支援金分の前年からの料率変化は含めていない、変更点だけを抜き出した簡易モデルです。
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className={thHead}>変更点</th>
                    <th className={thHead}>個人のまま</th>
                    <th className={thHead}>法人化</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>所得税の基礎控除</td>
                    <td className={td}>−36,000円（税率10%仮定）</td>
                    <td className={td}>0円（もともと所得税ゼロ）</td>
                  </tr>
                  <tr>
                    <td className={td}>給与所得控除</td>
                    <td className={td}>対象外</td>
                    <td className={td}>−約9,000円（住民税、税率10%仮定）</td>
                  </tr>
                  <tr>
                    <td className={td}>国民年金保険料</td>
                    <td className={td}>＋4,920円</td>
                    <td className={td}>対象外</td>
                  </tr>
                  <tr>
                    <td className={td}>国保の支援金分（新設）</td>
                    <td className={td}>＋12,862円</td>
                    <td className={td}>対象外</td>
                  </tr>
                  <tr>
                    <td className={td}>協会けんぽの料率変更と支援金</td>
                    <td className={td}>対象外</td>
                    <td className={td}>＋3,060円（労使合計）</td>
                  </tr>
                  <tr>
                    <th className={th}>合計</th>
                    <td className={`${td} font-bold`}>約−18,200円</td>
                    <td className={`${td} font-bold`}>約−5,900円</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Calc>
              <p>個人のまま：−36,000 ＋ 4,920 ＋ 12,862 ＝ −18,218円</p>
              <p>法人化：−9,000 ＋ 3,060 ＝ −5,940円</p>
              <p>差：18,218 − 5,940 ＝ 約12,300円、個人のままの方が有利な方向に動く</p>
            </Calc>
            <p className="mt-2">
              この前提では、2026年の変更によって法人化の節税メリットは年1.2万円ほど縮む計算になります。仮に限界税率を20%とすると所得税の減少は7.2万円になり、差は約4.8万円に広がります。いずれにしても、法人化の判断を根本からひっくり返すほどの規模ではありませんが、「損益分岐点ぎりぎり」の人にとっては結論が変わりうる金額です。
            </p>
          </section>

          <section>
            <H2>8. 法人代表者の実務：2026年の源泉徴収と年末調整</H2>
            <p>
              基礎控除や給与所得控除の改正は令和8年分の所得税から適用されますが、施行日は原則令和8年12月1日です。そのため
              <strong>令和8年11月までの毎月の源泉徴収は改正前のままで、12月の年末調整でまとめて精算</strong>されます。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>役員報酬を受け取っている法人代表者は、1〜11月に多めに源泉徴収された分が12月の年末調整で戻る形になります。</li>
              <li>マイクロ法人で年末調整を自分で行う場合は、給与計算ソフトや計算表が改正後の控除額に対応しているかを確認しておきましょう。</li>
              <li>2026年中に法人を設立して役員報酬の支給を始める場合も、その年の年末調整は改正後のルールで行います。</li>
              <li>国税庁の資料では、令和9年分以後の源泉徴収税額表も改正される予定とされています。</li>
            </ul>
          </section>

          <section>
            <H2>9. 防衛特別法人税（概要）</H2>
            <p>
              令和8年4月1日以後に開始する事業年度から、防衛特別法人税が課されます。概要としては「(法人税額 − 500万円) × 4%」で計算されるため、法人税額が500万円以下であれば実質的な負担は生じません。
            </p>
            <Calc>
              <p>中小法人の法人税率：所得800万円以下の部分15%（特例）、800万円超の部分23.2%</p>
              <p>法人税額が500万円になる所得：800万 × 15% ＝ 120万円、残り380万円 ÷ 23.2% ＝ 約1,638万円 → 800万 ＋ 1,638万 ＝ 約2,438万円</p>
            </Calc>
            <p className="mt-2">
              つまり、法人の課税所得がおおむね2,400万円台に届かない規模であれば影響はないと考えられます（税額控除などは考慮していない概算です）。法人化を検討する段階の個人事業主の多くには関係しない見込みですが、詳細な要件は国税庁の情報や税理士に確認してください。
            </p>
          </section>

          <section>
            <H2>まとめ：2026年に法人化を考える人へ</H2>
            <ul className="list-disc list-inside space-y-1">
              <li>所得489万円以下の個人事業主は、令和8・9年分の基礎控除の上乗せで個人のままの所得税が下がり、法人化の損益分岐点はやや上がる方向です。</li>
              <li>所得489万〜655万円の層は、法人化で本人の所得を489万円以下に収めると基礎控除が増えますが、2年間の特例である点に注意が必要です。</li>
              <li>給与所得控除の改正、国民年金の改定、社会保険の料率変更は、いずれも年数千円〜1万円程度の影響です。</li>
              <li>国保の上限113万円と、報酬に比例する健康保険の違いは、高所得の人ほど大きく効きます。役員報酬の設定次第で結論が変わります。</li>
            </ul>
            <p className="mt-2">
              ご自身の数字で比較するには、
              <Link href="/" className="text-blue-600 hover:underline">法人化シミュレーター</Link>
              をお使いください。計算に含めている税金・社会保険料の範囲と前提は
              <Link href="/calculation-policy" className="text-blue-600 hover:underline">計算根拠ページ</Link>
              に、所得別の目安は
              <Link href="/articles/break-even-table" className="text-blue-600 hover:underline">損益分岐点の早見表</Link>
              にまとめています。
            </p>
            <p className="mt-2 text-xs text-gray-600">
              ※本記事は2026年10月29日時点で確認できた公表資料にもとづく一般的な情報提供であり、個別の税務アドバイスではありません。計算例はすべて簡易モデルで、復興特別所得税、各種税額控除、標準報酬月額の等級、市区町村ごとの料率の違いなどは反映していません。実際の判断にあたっては、税理士や年金事務所・お住まいの市区町村にご確認ください。
            </p>
          </section>

          <section>
            <H2>出典</H2>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                国税庁「源泉所得税の改正のあらまし（令和8年4月）」
                <br />
                <Ext href="https://www.nta.go.jp/publication/pamph/gensen/2026kaisei.pdf">
                  https://www.nta.go.jp/publication/pamph/gensen/2026kaisei.pdf
                </Ext>
              </li>
              <li>
                国税庁 特設ページ（令和8年度税制改正 基礎控除の見直し等）
                <br />
                <Ext href="https://www.nta.go.jp/users/gensen/2026kiso/index.htm">
                  https://www.nta.go.jp/users/gensen/2026kiso/index.htm
                </Ext>
              </li>
              <li>
                京都市 市会資料（2026年5月、個人住民税関係）
                <br />
                <Ext href="https://www2.city.kyoto.lg.jp/shikai/img/iinkai/soumushoubou/R08/data/080525gyouzai.pdf">
                  https://www2.city.kyoto.lg.jp/shikai/img/iinkai/soumushoubou/R08/data/080525gyouzai.pdf
                </Ext>
              </li>
              <li>
                日本年金機構 お知らせ（令和8年度の国民年金保険料）
                <br />
                <Ext href="https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html">
                  https://www.nenkin.go.jp/oshirase/taisetu/kojin/2026/202604/0401.html
                </Ext>
              </li>
              <li>
                全国健康保険協会（協会けんぽ） 令和8年度 都道府県単位保険料率
                <br />
                <Ext href="https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08">
                  https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08
                </Ext>
              </li>
              <li>
                新宿区 国民健康保険料（令和8年度）
                <br />
                <Ext href="https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html">
                  https://www.city.shinjuku.lg.jp/hoken/hoken01_001028.html
                </Ext>
              </li>
            </ul>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm text-sm">
            シミュレーターで試してみる
          </Link>
        </div>
        <RelatedArticles currentSlug="2026-changes" />
      </main>

      <SiteFooter />
    </div>
  )
}
