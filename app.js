const STORAGE_KEY = "okataduke-itte-state-v1";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_FOLDER_NAME = "おかたづけ一手 Photos";
const MASCOTS = {
  broom: "assets/chibi-broom.png",
  laundry: "assets/chibi-laundry.png",
  geneTask: "assets/coach/gene-task.png",
  geneEnding: "assets/coach/gene-ending.png",
  geneEncourage: "assets/coach/gene-encourage.png",
  nadiaTask: "assets/coach/nadia-task.png",
  nadiaCelebrate: "assets/coach/nadia-celebrate.png",
  nadiaEncourage: "assets/coach/nadia-encourage.png"
};

const SPEAKERS = {
  gene: {
    name: "ジーン",
    src: MASCOTS.geneTask,
    encourageSrc: MASCOTS.geneEncourage,
    endingSrc: MASCOTS.geneEnding,
    lines: [
      "ぼくが次の一手を選んでおきました。ここだけで大丈夫です。",
      "全部を見なくて平気です。今はこの一手だけで十分です。",
      "迷いどころはぼくが持っておきます。手だけ動かしてください。",
      "焦らなくて大丈夫です。順番に進めていきましょう。",
      "止まっても平気です。次の一手はここにあります。",
      "小さく終わる形にしてあります。無理に広げないでください。",
      "ぼくが横で見ています。終わったら合図をください。",
      "ここまで来られたので、もう十分に始まっています。",
      "判断はぼくの方で減らしてあります。書いてある分だけで大丈夫です。",
      "困ったら、ひとつだけ手に取ってみてください。",
      "次の置き場所は、あとで考えましょう。今は動かすところからで十分です。",
      "呼吸をひとつ。それから一手だけ、ぼくと一緒に。"
    ],
    encourageLines: [
      "ここまで来られたなら、もう十分です。",
      "いいですね。ひとつ進みました。",
      "胸を張っていいやつです、これは。",
      "ここで一息どうぞ。次の一手はぼくが選びます。",
      "無理せずここまで。すばらしいです。",
      "小さい積み重ね、ちゃんと残っています。"
    ],
    skipLines: [
      "合いませんでしたね。次のを出します。",
      "飛ばして大丈夫です。ぼくが次を選びます。",
      "このタスクは置いておきましょう。気にしないで大丈夫です。",
      "合わないものは合わない、で十分です。次にいきましょう。"
    ]
  },
  nadia: {
    name: "ナディア",
    src: MASCOTS.nadiaTask,
    encourageSrc: MASCOTS.nadiaEncourage,
    endingSrc: MASCOTS.nadiaCelebrate,
    lines: [
      "これいいね、まずこれやっちゃお！終わったら押してね。",
      "考えるとこは私が持つから、手だけ動かせばOK！",
      "一気にやらなくていいよ、これ片づけたら勝ち！",
      "迷うものは保留でいいから、まず手を動かしちゃお。",
      "小さい前進、めっちゃえらいよ。次これね！",
      "ここだけ見てれば大丈夫、次は私が出すね！",
      "完璧じゃなくていいの。今の一手がちゃんと効くから！",
      "いい感じ！終わったら押して、次一緒に選ぼ！",
      "目についた一個でいいよ、私が勢いつけるから！",
      "今日は無理しない、一手だけ遊ぶ感じでいこ！",
      "置いたら終わり！考えすぎる前にやっちゃお！",
      "今の一手、未来の自分が絶対助かるやつ！"
    ],
    encourageLines: [
      "やった！ひとつクリア！",
      "いい感じ！この調子この調子！",
      "ここまでで十分えらいよ、ちょっと水飲も！",
      "勢い出てきた！次も小さくいこ！",
      "うん、めっちゃ進んでる！見えてきた！",
      "私、いま結構誇らしいよ！"
    ],
    skipLines: [
      "合わなかった！次これで！",
      "パスでOK！次いこ！",
      "うん、飛ばそ！次の方が合うかも！",
      "そういう時もある！気にしないでいこ！"
    ]
  }
};

const defaultAreas = [
  { id: "desk", name: "机", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "office_desk", name: "オフィスの机", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "futon", name: "布団周り", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "floor", name: "床", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "kitchen", name: "キッチン", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "entry", name: "玄関", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "sink", name: "洗面所", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "bath", name: "バスルーム", level: 1, completedCount: 0, lastWorkedAt: null },
  { id: "closet", name: "クローゼット", level: 1, completedCount: 0, lastWorkedAt: null }
];
const modes = [
  { id: "low_energy", label: "低エネルギー", hint: "1つ、3つ、置くだけ中心", categories: ["trash", "floor", "clothes", "tiny"], energy: "low" },
  { id: "normal", label: "普通", hint: "3個だけを淡々と", categories: ["trash", "floor", "paper", "clothes", "tiny"], energy: "normal" },
  { id: "motivated", label: "やる気あり", hint: "5個まで出します", categories: ["trash", "floor", "paper", "clothes", "dishes"], energy: "high" },
  { id: "trash_only", label: "ゴミだけ", hint: "捨てる判断が明らかなもの", categories: ["trash"], energy: "low" },
  { id: "floor_only", label: "床だけ", hint: "床面を少し取り戻す", categories: ["floor"], energy: "low" },
  { id: "paper_only", label: "紙類だけ", hint: "読む判断はしない", categories: ["paper"], energy: "normal" },
  { id: "clothes_only", label: "服だけ", hint: "洗濯・収納の入口だけ", categories: ["clothes"], energy: "normal" }
];

const taskTemplates = [
  { id: "desk_paper_stack_3", text: "机の紙を、あれば最大3枚そろえて重ねる", areaIds: ["desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "desk_pen_3", text: "ペン・はさみ・付箋など、文具を最大3つペン立てか引き出しに戻す", areaIds: ["desk"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "desk_trash_3", text: "明らかなゴミを、見つけたぶんだけ捨てる(最大3つ)", areaIds: ["desk"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "desk_cup_1", text: "コップや皿があれば1つだけ流しへ運ぶ", areaIds: ["desk"], category: "dishes", energy: "low", estimatedMinutes: 1 },
  { id: "desk_clear_palm", text: "机の端を、手のひら1枚分だけ空ける", areaIds: ["desk"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "desk_items_3", text: "使っていない小物があれば、3つだけ一か所に寄せる", areaIds: ["desk"], category: "tiny", energy: "low", estimatedMinutes: 2 },

  { id: "office_doc_stack_3", text: "書類を、あれば最大3枚、同じ向きに重ねる", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "office_paper_trash_3", text: "明らかな紙ゴミを、見つけたぶんだけ捨てる(最大3枚)", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "office_memo_1", text: "期限切れ・不要なメモが1枚あれば捨てる", areaIds: ["office_desk"], category: "paper", energy: "normal", estimatedMinutes: 2 },
  { id: "office_items_3", text: "小物を、あれば3つだけ机の端に寄せる", areaIds: ["office_desk"], category: "tiny", energy: "low", estimatedMinutes: 2 },
  { id: "office_pens_3", text: "ペン・はさみ・テープなど文具を、あれば最大3つまとめる", areaIds: ["office_desk"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "office_mail_3", text: "郵便物や封筒を、あれば最大3つ一か所に置く", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "office_receipt_3", text: "レシートを、あれば最大3枚まとめる", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 1 },
  { id: "office_front_palm", text: "机の手前を、手のひら1枚分だけ空ける", areaIds: ["office_desk"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "office_package_1", text: "空き袋・包装紙・封筒のどれかが1つあれば捨てる", areaIds: ["office_desk"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "office_hold_doc_1", text: "判断が必要な書類が1枚あれば、保留場所に置く", areaIds: ["office_desk"], category: "paper", energy: "low", estimatedMinutes: 2 },

  { id: "futon_clothes_3", text: "布団周りの服を、あれば最大3枚集める", areaIds: ["futon"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "futon_trash_3", text: "枕元のゴミを、見つけたぶんだけ捨てる(最大3つ)", areaIds: ["futon"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "futon_floor_3", text: "床のものを、あれば3個だけ拾う", areaIds: ["futon"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "futon_book_1", text: "読みかけの本があれば1冊だけ置き場に戻す", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "futon_cord_1", text: "充電コードや延長コードを1本だけよける", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "futon_top_3", text: "布団の上のものを、あれば3個どかす", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 2 },
  { id: "futon_roller_3", text: "粘着テープのコロコロを布団のまわりに3往復だけかける", areaIds: ["futon"], category: "floor", energy: "normal", estimatedMinutes: 2 },
  { id: "futon_clear_palm", text: "布団の上を、手のひら1枚分だけ空ける", areaIds: ["futon"], category: "tiny", energy: "low", estimatedMinutes: 2 },

  { id: "floor_pick_3", text: "床のものを、あれば3個拾う", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "floor_path_3", text: "通り道のものを、あれば3個だけ端に寄せる", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 2 },
  { id: "floor_trash_3", text: "床のゴミを、見つけたぶんだけ捨てる(最大3つ)", areaIds: ["floor"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "floor_clothes_3", text: "床の服を、あれば最大3枚カゴに入れる", areaIds: ["floor"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "floor_paper_3", text: "床の紙類を、あれば最大3枚拾う", areaIds: ["floor"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "floor_danger_1", text: "足元の危ないものが1つあればどかす", areaIds: ["floor"], category: "floor", energy: "low", estimatedMinutes: 1 },
  { id: "floor_roller_3", text: "粘着テープのコロコロを床に3往復だけかける", areaIds: ["floor"], category: "floor", energy: "normal", estimatedMinutes: 2 },

  { id: "kitchen_sink_3", text: "シンクの中のものを、あれば3つだけ動かす", areaIds: ["kitchen"], category: "dishes", energy: "low", estimatedMinutes: 2 },
  { id: "kitchen_container_1", text: "空き容器が1つあれば捨てる", areaIds: ["kitchen"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "kitchen_spice_1", text: "出しっぱなしの調味料が1つあれば元の場所に戻す", areaIds: ["kitchen"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "kitchen_cup_1", text: "コップか皿を1つだけ洗う", areaIds: ["kitchen"], category: "dishes", energy: "normal", estimatedMinutes: 2 },
  { id: "kitchen_counter_palm", text: "台の上を、手のひら1枚分だけ空ける", areaIds: ["kitchen"], category: "tiny", energy: "normal", estimatedMinutes: 2 },
  { id: "kitchen_trash_3", text: "明らかなゴミを、見つけたぶんだけ捨てる(最大3つ)", areaIds: ["kitchen"], category: "trash", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_dates_3", text: "冷蔵庫の中の期限を、見える範囲で3つだけ見る", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_expired_1", text: "期限切れの食品が1つあれば捨てる", areaIds: ["kitchen"], category: "fridge", energy: "normal", estimatedMinutes: 2 },
  { id: "fridge_empty_1", text: "冷蔵庫の中の空容器が1つあれば捨てる", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 1 },
  { id: "fridge_front_3", text: "冷蔵庫の手前のものを、あれば3つだけ並べ直す", areaIds: ["kitchen"], category: "fridge", energy: "low", estimatedMinutes: 2 },
  { id: "fridge_veg_1", text: "野菜室の明らかに傷んだものが1つあれば確認する", areaIds: ["kitchen"], category: "fridge", energy: "normal", estimatedMinutes: 2 },

  { id: "entry_shoes_align_1", text: "出ている靴を1足だけ揃える", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_shoes_put_1", text: "出しっぱなしの靴があれば1足だけしまう", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_trash_1", text: "玄関のゴミが1つあれば捨てる", areaIds: ["entry"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "entry_umbrella_1", text: "傘を1本だけ整える", areaIds: ["entry"], category: "entry", energy: "low", estimatedMinutes: 1 },
  { id: "entry_mail_3", text: "郵便物を、あれば最大3枚一か所に置く", areaIds: ["entry"], category: "paper", energy: "low", estimatedMinutes: 2 },
  { id: "entry_floor_1", text: "玄関の床のものを1つだけどかす", areaIds: ["entry"], category: "floor", energy: "low", estimatedMinutes: 1 },

  { id: "sink_items_3", text: "洗面台の上のものを、あれば3つだけ寄せる", areaIds: ["sink"], category: "sink", energy: "low", estimatedMinutes: 2 },
  { id: "sink_empty_1", text: "空の容器が1つあれば捨てる", areaIds: ["sink"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "sink_towel_1", text: "使い終わったタオルを1枚だけ洗濯カゴへ入れる", areaIds: ["sink"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "sink_toothbrush_1", text: "歯ブラシまわりを1つだけ戻す", areaIds: ["sink"], category: "sink", energy: "low", estimatedMinutes: 1 },
  { id: "sink_hair_1", text: "髪の毛やゴミをティッシュで1回だけ取る", areaIds: ["sink"], category: "trash", energy: "low", estimatedMinutes: 1 },
  { id: "sink_clear_palm", text: "洗面台を、手のひら1枚分だけ空ける", areaIds: ["sink"], category: "sink", energy: "normal", estimatedMinutes: 2 },

  { id: "bath_empty_bottle_1", text: "空のボトルが1つあれば捨てる", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_bottles_3", text: "ボトルを、あれば3本だけ並べ直す", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_drain_1", text: "排水口まわりの見えるゴミを1つだけ取る", areaIds: ["bath"], category: "bath", energy: "normal", estimatedMinutes: 2 },
  { id: "bath_item_1", text: "浴室内の小物を1つだけ戻す", areaIds: ["bath"], category: "bath", energy: "low", estimatedMinutes: 1 },
  { id: "bath_towel_1", text: "使い終わったタオルを1枚だけ洗濯カゴへ入れる", areaIds: ["bath"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "bath_floor_1", text: "床のものを1つだけ外へ出す", areaIds: ["bath"], category: "floor", energy: "low", estimatedMinutes: 1 },

  { id: "closet_hanger_3", text: "服を、あれば最大3枚ハンガーにかける", areaIds: ["closet"], category: "clothes", energy: "normal", estimatedMinutes: 2 },
  { id: "closet_laundry_3", text: "洗濯物を、あれば最大3枚カゴに入れる", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "closet_floor_clothes_3", text: "床の服を、あれば最大3枚拾う", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 2 },
  { id: "closet_wash_1", text: "明らかに洗う服が1枚あれば分ける", areaIds: ["closet"], category: "clothes", energy: "low", estimatedMinutes: 1 },
  { id: "closet_bag_1", text: "出ているバッグが1つあれば定位置に戻す", areaIds: ["closet"], category: "tiny", energy: "low", estimatedMinutes: 1 },
  { id: "closet_drawer_1", text: "開いている引き出しを1段だけ閉める", areaIds: ["closet"], category: "tiny", energy: "low", estimatedMinutes: 1 }
];

const FALLBACK_TASKS = [
  { id: "fallback_eye_1", text: "目に入ったものを1つだけ手に取って、その辺によける", areaIds: null, category: "fallback", energy: "low", estimatedMinutes: 1 },
  { id: "fallback_palm_1", text: "目の前で、手のひら1枚分のスペースを作る", areaIds: null, category: "fallback", energy: "low", estimatedMinutes: 1 },
  { id: "fallback_one_1", text: "目につくものを1つだけ、定位置の方へ動かす", areaIds: null, category: "fallback", energy: "low", estimatedMinutes: 1 },
  { id: "fallback_breath_1", text: "ひと呼吸おいて、視界に入る何かを1つどかす", areaIds: null, category: "fallback", energy: "low", estimatedMinutes: 1 }
];
const praisePairs = [
  {
    gene: "ここで閉じて大丈夫です。今日の一手、ちゃんと進みました。",
    nadia: "うん、十分！あとは写真だけ見て、にやっとしよ！"
  },
  {
    gene: "全部終わらせなくて大丈夫です。区切れたら成功です。",
    nadia: "そうそう！続きは次の私たちに任せちゃお！"
  },
  {
    gene: "始める前より、少し扱いやすくなっています。",
    nadia: "その少しが強いんだよね、わかってるよ！"
  },
  {
    gene: "今日はここまでにしましょう。ぼくは十分だと思います。",
    nadia: "賛成！えらいから水飲んで休も！"
  },
  {
    gene: "中断ではなく、ちゃんと終わりを作れました。",
    nadia: "いい終わり方！次もここから始められるね！"
  },
  {
    gene: "一手ずつ進めた分は、ちゃんと残ります。",
    nadia: "消えない進歩だ！今日の自分に拍手しとこ！"
  },
  {
    gene: "写真を見比べてみてください。きっと変化があります。",
    nadia: "小さい変化でも見つけたら勝ち！私も探す！"
  },
  {
    gene: "ここで止める判断も、片づけのうちです。",
    nadia: "終わるの上手！勢いを明日に残そ！"
  },
  {
    gene: "次に来たとき、ぼくがまた一手だけ出します。",
    nadia: "だから今日は閉店！おつかれさまっ！"
  },
  {
    gene: "今できる分を、きちんとやれました。",
    nadia: "うん、ちゃんとやった！完璧よりずっと使えるやつ！"
  }
];

const timeUpPairs = [
  {
    gene: "5分、ここまでです。きれいな区切りでした。",
    nadia: "時間切れって名前の、ちゃんとした区切り！"
  },
  {
    gene: "時間が来ました。続きはまた次に。",
    nadia: "今日はこれで卒業！えらい！"
  },
  {
    gene: "時間内に進めた分、ちゃんと残っています。",
    nadia: "うん、ここまでで十分！次の私たちに任せよ！"
  },
  {
    gene: "区切りの合図です。ぼくの方で時計を止めました。",
    nadia: "アラーム鳴ったらおしまい、シンプルでよし！"
  }
];

const zeroDonePair = {
  gene: "始めるところまで来られました。それだけで十分です。",
  nadia: "今日は始められたこと自体が勝ち！えらい！"
};

const GENE_CHEERS = [
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "進みました。ここで一息どうぞ。" },
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "いいですね。ひとつ片づきました。" },
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "その一手で十分です。" },
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "ちゃんと記録しています。" },
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "胸を張っていいやつです。" },
  { name: "ジーン", src: MASCOTS.geneEncourage, text: "すばらしいです。次もこの調子で。" }
];

const NADIA_CHEERS = [
  { name: "ナディア", src: MASCOTS.nadiaCelebrate, text: "やった！今の一手、勝ち！" },
  { name: "ナディア", src: MASCOTS.nadiaCelebrate, text: "今ちょっと部屋が軽くなった！" },
  { name: "ナディア", src: MASCOTS.nadiaEncourage, text: "いいじゃん！次も小さくいこ！" },
  { name: "ナディア", src: MASCOTS.nadiaCelebrate, text: "クリア！次これね！" },
  { name: "ナディア", src: MASCOTS.nadiaEncourage, text: "うん、めっちゃ進んでる！" },
  { name: "ナディア", src: MASCOTS.nadiaCelebrate, text: "えらい！水飲も！" }
];

let state = loadState();
let selectedMode = state.session?.mode || "normal";
let selectedDuration = state.session?.durationMinutes || 5;
let timerId = null;
let toastTimer = null;
let driveToken = null;
let driveTokenExpiresAt = 0;
let driveTokenClient = null;
let pendingStartAreaId = null;
let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);

function createInitialState() {
  return {
    areas: structuredClone(defaultAreas),
    todayDate: todayKey(),
    todayCompleted: 0,
    heldTasks: [],
    session: null,
    lastTaskIndex: 0,
    customTasks: {},
    drive: {
      clientId: "",
      folderId: null
    }
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const initial = saved || createInitialState();
    if (initial.todayDate !== todayKey()) {
      initial.todayDate = todayKey();
      initial.todayCompleted = 0;
    }
    initial.areas = normalizeAreas(initial.areas);
    if (!initial.customTasks) initial.customTasks = {};
    if (!initial.drive) initial.drive = { clientId: "", folderId: null };
    return initial;
  } catch {
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeAreas(savedAreas) {
  const source = Array.isArray(savedAreas) ? savedAreas : [];
  const migrated = source
    .filter((area) => area && typeof area === "object")
    .map((area) => {
      if (area.id === "bed") return { ...area, id: "futon", name: "布団周り" };
      return area;
    })
    .filter((area) => typeof area.id === "string" && area.id.trim())
    .map((area) => ({
      id: area.id.trim(),
      name: typeof area.name === "string" && area.name.trim() ? area.name.trim() : area.id.trim(),
      level: Number.isFinite(area.level) ? area.level : 1,
      completedCount: Number.isFinite(area.completedCount) ? area.completedCount : 0,
      lastWorkedAt: area.lastWorkedAt || null
    }));
  const byId = new Map(migrated.map((area) => [area.id, area]));
  defaultAreas.forEach((area) => {
    if (!byId.has(area.id)) byId.set(area.id, { ...area });
    else byId.set(area.id, { ...area, ...byId.get(area.id), name: byId.get(area.id).name || area.name });
  });
  return Array.from(byId.values()).filter((area) => area.id !== "bed");
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
}

function renderHome() {
  state.areas = normalizeAreas(state.areas);
  $("todayCount").textContent = state.todayCompleted;
  $("holdCount").textContent = Object.values(state.customTasks || {}).filter((items) => items?.length).length;
  $("areaCount").textContent = state.areas.length;
  $("headerResumeButton").classList.toggle("hidden", !state.session?.isActive);

  const areaGrid = $("areaGrid");
  areaGrid.innerHTML = "";
  state.areas.forEach((area) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "area-card";
    card.dataset.areaId = area.id;
    const percent = Math.min(100, area.completedCount * 10);
    card.innerHTML = `
      <strong>${escapeHtml(area.name)}</strong>
      <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
      <small>${area.completedCount}手 完了 ・ 押して開始</small>
    `;
    card.addEventListener("click", () => startSessionForArea(area.id));
    areaGrid.append(card);
  });
  renderDriveStatus();
}

function renderSetup({ resetBefore = false, beforeImage } = {}) {
  if (resetBefore) {
    $("beforeInput").value = "";
    $("beforePreview").removeAttribute("src");
    $("beforePreview").classList.add("hidden");
  } else if (beforeImage) {
    setImage($("beforePreview"), beforeImage);
  }

  const areaSelect = $("areaSelect");
  areaSelect.innerHTML = "";
  state.areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    areaSelect.append(option);
  });
  if (state.session?.areaId) areaSelect.value = state.session.areaId;

  const modeGrid = $("modeGrid");
  modeGrid.innerHTML = "";
  modes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-card ${mode.id === selectedMode ? "selected" : ""}`;
    button.dataset.mode = mode.id;
    button.innerHTML = `<strong>${mode.label}</strong><span>${mode.hint}</span>`;
    button.addEventListener("click", () => {
      selectedMode = mode.id;
      renderSetup();
    });
    modeGrid.append(button);
  });

  document.querySelectorAll("#durationGroup button").forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.duration) === selectedDuration);
  });
}

function startSession() {
  const areaId = $("areaSelect").value;
  beginSession({
    areaId,
    mode: selectedMode,
    durationMinutes: selectedDuration,
    beforeImage: $("beforePreview").src || null
  });
}

function startSessionForArea(areaId) {
  selectedMode = modeForArea(areaId);
  selectedDuration = 5;
  pendingStartAreaId = areaId;
  const area = state.areas.find((item) => item.id === areaId);
  $("quickBeforeInput").value = "";
  $("quickBeforePreview").removeAttribute("src");
  $("quickBeforePreview").classList.add("hidden");
  $("beforeDialogArea").textContent = `${area?.name || "このエリア"}を始める前の写真を残せます。撮らなくてもすぐ始められます。`;
  openDialog("beforeDialog");
}

function startPendingSession(beforeImage = null) {
  if (!pendingStartAreaId) return;
  const areaId = pendingStartAreaId;
  pendingStartAreaId = null;
  $("beforeDialog").close();
  beginSession({
    areaId,
    mode: selectedMode,
    durationMinutes: selectedDuration,
    beforeImage
  });
}

function beginSession({ areaId, mode, durationMinutes, beforeImage }) {
  state.session = {
    id: `session-${Date.now()}`,
    areaId,
    mode,
    startedAt: new Date().toISOString(),
    durationMinutes,
    completedCount: 0,
    skipStreak: 0,
    currentTask: chooseTask(mode, areaId),
    beforeImage,
    afterImage: null,
    isActive: true,
    endsAt: Date.now() + durationMinutes * 60 * 1000,
    endReason: null
  };
  saveState();
  renderRun();
  showScreen("runScreen");
  startTimer();
  uploadSessionPhoto("before");
}

function modeForArea(areaId) {
  if (areaId === "floor") return "floor_only";
  if (areaId === "closet" || areaId === "futon") return "clothes_only";
  if (areaId === "desk" || areaId === "office_desk") return "paper_only";
  return "normal";
}

function resumeSession() {
  if (!state.session?.isActive) return;
  if (!state.session.endsAt) {
    state.session.endsAt = Date.now() + state.session.durationMinutes * 60 * 1000;
  }
  renderRun();
  showScreen("runScreen");
  startTimer();
}

function chooseTask(modeId, areaId = state.session?.areaId) {
  if ((state.session?.skipStreak || 0) >= 2) {
    const task = FALLBACK_TASKS[state.lastTaskIndex % FALLBACK_TASKS.length];
    state.lastTaskIndex += 1;
    return task;
  }
  const customList = customTaskTemplatesForArea(areaId);
  if (customList.length) {
    const task = customList[state.lastTaskIndex % customList.length];
    state.lastTaskIndex += 1;
    return task;
  }
  const mode = modes.find((item) => item.id === modeId) || modes[1];
  const pool = taskTemplates.filter((task) => {
    const areaMatch = !task.areaIds || task.areaIds.includes(areaId);
    const categoryMatch = mode.categories.includes(task.category) || areaMatch;
    const energyMatch = mode.energy === "high" || task.energy !== "high";
    return areaMatch && categoryMatch && energyMatch;
  });
  const fallback = taskTemplates.filter((task) => !task.areaIds || task.areaIds.includes(areaId));
  const list = pool.length ? pool : fallback.length ? fallback : taskTemplates;
  const task = list[state.lastTaskIndex % list.length];
  state.lastTaskIndex += 1;
  return task;
}

function customTaskTemplatesForArea(areaId) {
  const lines = state.customTasks?.[areaId];
  if (!Array.isArray(lines) || !lines.length) return [];
  return lines.map((text, index) => ({
    id: `custom_${areaId}_${index}`,
    text,
    areaIds: [areaId],
    category: "custom",
    energy: "low",
    estimatedMinutes: 2
  }));
}

function defaultTaskTextsForArea(areaId) {
  return taskTemplates
    .filter((task) => task.areaIds?.includes(areaId))
    .map((task) => task.text);
}

function renderRun() {
  const session = state.session;
  const area = state.areas.find((item) => item.id === session.areaId);
  const speaker = speakerForTask(session.currentTask);
  const isEncourage = session.completedCount > 0 && session.completedCount % 3 === 0;
  $("currentArea").textContent = area?.name || "エリア";
  $("taskText").textContent = session.currentTask?.text || "ゴミを3つ捨てる";
  $("sessionDoneCount").textContent = session.completedCount;
  $("coachName").textContent = speaker.name;
  $("coachLine").textContent = speaker.lines[session.completedCount % speaker.lines.length];
  $("runMascot").src = isEncourage ? speaker.encourageSrc : speaker.src;
  $("runMascot").alt = speaker.name;
  renderTimer();
}

function completeTask({ repeat = false } = {}) {
  const session = state.session;
  if (!session?.isActive) return;
  const finishedTask = session.currentTask;
  session.completedCount += 1;
  session.skipStreak = 0;
  state.todayCompleted += 1;
  const area = state.areas.find((item) => item.id === session.areaId);
  if (area) {
    area.completedCount += 1;
    area.lastWorkedAt = new Date().toISOString();
  }
  if (!repeat) session.currentTask = chooseTask(session.mode, session.areaId);
  saveState();
  renderRun();
  showCheerPop(finishedTask, session.completedCount);
}

function skipTask({ silent = false } = {}) {
  const session = state.session;
  if (!session?.isActive) return;
  const skippedTask = session.currentTask;
  session.skipStreak = (session.skipStreak || 0) + 1;
  session.currentTask = chooseTask(session.mode, session.areaId);
  saveState();
  renderRun();
  if (!silent) showSkipPop(skippedTask);
}

function endSession(reason = "manual") {
  if (!state.session) return;
  state.session.isActive = false;
  state.session.endReason = reason;
  saveState();
  stopTimer();
  renderSummary();
  showScreen("summaryScreen");
}

function renderSummary() {
  const session = state.session;
  const done = session?.completedCount || 0;
  let praise;
  if (done === 0) {
    praise = zeroDonePair;
  } else if (session?.endReason === "timeout") {
    praise = timeUpPairs[done % timeUpPairs.length];
  } else {
    praise = praisePairs[done % praisePairs.length];
  }
  $("summarySessionCount").textContent = done;
  $("summaryTodayCount").textContent = state.todayCompleted;
  $("summaryGeneDialogue").querySelector("b").textContent = praise.gene;
  $("summaryNadiaDialogue").querySelector("b").textContent = praise.nadia;
  $("summaryGeneMascot").src = MASCOTS.geneEnding;
  $("summaryNadiaMascot").src = MASCOTS.nadiaCelebrate;
  setImage($("summaryBefore"), session?.beforeImage);
  setImage($("summaryAfter"), session?.afterImage);
}

function renderDriveStatus() {
  $("driveClientIdInput").value = state.drive?.clientId || "";
  const status = $("driveStatus");
  const connected = hasDriveToken();
  status.textContent = connected ? "接続中" : state.drive?.clientId ? "未接続" : "未設定";
  status.classList.toggle("connected", connected);
}

function saveDriveClientId() {
  state.drive.clientId = $("driveClientIdInput").value.trim();
  state.drive.folderId = null;
  driveToken = null;
  driveTokenExpiresAt = 0;
  driveTokenClient = null;
  saveState();
  renderDriveStatus();
  showToast(state.drive.clientId ? "Drive設定を保存しました" : "Drive設定を空にしました");
}

function hasDriveToken() {
  return Boolean(driveToken && Date.now() < driveTokenExpiresAt - 60000);
}

function connectDrive() {
  const clientId = state.drive?.clientId || $("driveClientIdInput").value.trim();
  if (!clientId) {
    showToast("OAuthクライアントIDを入れてください");
    return Promise.reject(new Error("Missing Google OAuth client ID"));
  }
  if (!window.google?.accounts?.oauth2) {
    showToast("Google認証ライブラリを読み込み中です");
    return Promise.reject(new Error("Google Identity Services is not loaded"));
  }
  state.drive.clientId = clientId;
  saveState();
  return new Promise((resolve, reject) => {
    driveTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || "Drive authorization failed"));
          return;
        }
        driveToken = response.access_token;
        driveTokenExpiresAt = Date.now() + Number(response.expires_in || 3600) * 1000;
        renderDriveStatus();
        showToast("Google Driveに接続しました");
        resolve(driveToken);
      },
      error_callback: () => {
        reject(new Error("Drive authorization popup was closed"));
      }
    });
    driveTokenClient.requestAccessToken({ prompt: "consent" });
  }).catch((error) => {
    showToast("Drive接続に失敗しました");
    throw error;
  });
}

async function getDriveToken() {
  if (hasDriveToken()) return driveToken;
  return connectDrive();
}

async function ensureDriveFolder() {
  if (state.drive.folderId) return state.drive.folderId;
  const token = await getDriveToken();
  const query = [
    `name = '${DRIVE_FOLDER_NAME.replace(/'/g, "\\'")}'`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false"
  ].join(" and ");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`;
  const found = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(assertDriveResponse);
  if (found.files?.[0]?.id) {
    state.drive.folderId = found.files[0].id;
    saveState();
    return state.drive.folderId;
  }
  const created = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder"
    })
  }).then(assertDriveResponse);
  state.drive.folderId = created.id;
  saveState();
  return created.id;
}

async function uploadSessionPhoto(kind) {
  const session = state.session;
  const dataUrl = kind === "before" ? session?.beforeImage : session?.afterImage;
  if (!dataUrl || !state.drive?.clientId) return;
  try {
    const folderId = await ensureDriveFolder();
    const token = await getDriveToken();
    const blob = dataUrlToBlob(dataUrl);
    const extension = blob.type.includes("png") ? "png" : "jpg";
    const area = state.areas.find((item) => item.id === session.areaId)?.name || "area";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}_${safeFileName(area)}_${kind}.${extension}`;
    const metadata = {
      name: filename,
      parents: [folderId]
    };
    const boundary = `okataduke_${Date.now()}`;
    const body = new Blob([
      `--${boundary}\r\n`,
      "Content-Type: application/json; charset=UTF-8\r\n\r\n",
      JSON.stringify(metadata),
      `\r\n--${boundary}\r\n`,
      `Content-Type: ${blob.type || "image/jpeg"}\r\n\r\n`,
      blob,
      `\r\n--${boundary}--`
    ], { type: `multipart/related; boundary=${boundary}` });
    const uploaded = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body
    }).then(assertDriveResponse);
    if (!session.driveFiles) session.driveFiles = {};
    session.driveFiles[kind] = uploaded;
    saveState();
    showToast(`${kind === "before" ? "Before" : "After"}写真をDriveに保存しました`);
  } catch (error) {
    showToast("Drive保存に失敗しました");
    console.error(error);
  }
}

async function assertDriveResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Drive API error ${response.status}`);
  }
  return data;
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function safeFileName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "_").slice(0, 32);
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    renderTimer();
    if (remainingMs() <= 0) endSession("timeout");
  }, 500);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function remainingMs() {
  if (!state.session?.endsAt) return 0;
  return Math.max(0, state.session.endsAt - Date.now());
}

function renderTimer() {
  const totalSeconds = Math.ceil(remainingMs() / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  $("timerText").textContent = `${minutes}:${seconds}`;
}

function showPop({ src, name, text }) {
  const pop = $("completionPop");
  $("completionMascot").src = src;
  $("completionMascot").alt = name;
  $("completionLine").textContent = text;
  pop.classList.remove("hidden", "show");
  void pop.offsetWidth;
  pop.classList.add("show");
  window.setTimeout(() => pop.classList.add("hidden"), 1200);
}

function showCheerPop(finishedTask, completedCount) {
  const speaker = speakerForTask(finishedTask);
  const cheers = speaker === SPEAKERS.nadia ? NADIA_CHEERS : GENE_CHEERS;
  const cheer = cheers[(completedCount - 1) % cheers.length];
  showPop({ src: cheer.src, name: cheer.name, text: cheer.text });
}

function showSkipPop(skippedTask) {
  const speaker = speakerForTask(skippedTask);
  const lines = speaker.skipLines || [];
  if (!lines.length) {
    showToast("スキップしました");
    return;
  }
  const line = lines[Math.floor(Math.random() * lines.length)];
  showPop({ src: speaker.encourageSrc, name: speaker.name, text: line });
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add("hidden"), 2300);
}

function speakerForTask(task) {
  if (!task) return SPEAKERS.gene;
  if (task.category === "clothes" || task.category === "paper") return SPEAKERS.nadia;
  if (task.category === "custom" || task.category === "fallback") {
    const areaId = task.areaIds?.[0] || state.session?.areaId;
    const nadiaAreas = ["closet", "futon"];
    if (nadiaAreas.includes(areaId)) return SPEAKERS.nadia;
  }
  return SPEAKERS.gene;
}

function readImage(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function setImage(img, src) {
  if (src) {
    img.src = src;
    img.classList.remove("hidden");
  } else {
    img.removeAttribute("src");
  }
}

function addArea() {
  const name = $("areaNameInput").value.trim();
  if (!name) return;
  state.areas.push({
    id: `area-${Date.now()}`,
    name,
    level: 1,
    completedCount: 0,
    lastWorkedAt: null
  });
  $("areaNameInput").value = "";
  $("areaDialog").close();
  saveState();
  renderHome();
}

function openDialog(dialogId) {
  const dialog = $(dialogId);
  if (!dialog) return;
  if (dialog.open) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function openTaskEditor(areaId = state.areas[0]?.id) {
  renderTaskAreaOptions();
  $("taskAreaSelect").value = areaId || state.areas[0]?.id || "";
  renderTaskEditor();
  openDialog("taskDialog");
}

function renderTaskAreaOptions() {
  const select = $("taskAreaSelect");
  select.innerHTML = "";
  state.areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    select.append(option);
  });
}

function renderTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  const custom = state.customTasks?.[areaId];
  const lines = Array.isArray(custom) ? custom : defaultTaskTextsForArea(areaId);
  $("taskListInput").value = lines.join("\n");
}

function saveTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  const lines = $("taskListInput").value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  state.customTasks[areaId] = lines;
  saveState();
  $("taskDialog").close();
  showToast("掃除タスクを保存しました");
}

function resetTaskEditor() {
  const areaId = $("taskAreaSelect").value;
  delete state.customTasks[areaId];
  saveState();
  renderTaskEditor();
  showToast("初期候補に戻しました");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function bindEvents() {
  $("homeButton").addEventListener("click", () => {
    stopTimer();
    renderHome();
    showScreen("homeScreen");
  });
  $("installButton").addEventListener("click", installApp);
  $("resetButton").addEventListener("click", () => {
    if (!confirm("保存データをリセットしますか？")) return;
    stopTimer();
    state = createInitialState();
    selectedMode = "normal";
    selectedDuration = 5;
    saveState();
    renderHome();
    showScreen("homeScreen");
    showToast("リセットしました");
  });
  $("headerResumeButton").addEventListener("click", resumeSession);
  $("headerAddAreaButton").addEventListener("click", () => openDialog("areaDialog"));
  $("editTasksButton").addEventListener("click", () => openTaskEditor());
  $("saveDriveClientButton").addEventListener("click", saveDriveClientId);
  $("connectDriveButton").addEventListener("click", () => {
    connectDrive().catch((error) => console.error(error));
  });
  $("skipBeforeButton").addEventListener("click", () => startPendingSession(null));
  $("startWithBeforeButton").addEventListener("click", () => {
    startPendingSession($("quickBeforePreview").src || null);
  });
  $("beginSessionButton").addEventListener("click", startSession);
  $("doneButton").addEventListener("click", () => completeTask());
  $("skipButton").addEventListener("click", skipTask);
  $("endButton").addEventListener("click", () => endSession("manual"));
  $("continueButton").addEventListener("click", () => {
    selectedMode = state.session?.mode || selectedMode;
    renderSetup({ beforeImage: state.session?.beforeImage });
    showScreen("setupScreen");
  });
  $("finishButton").addEventListener("click", () => {
    state.session = null;
    saveState();
    renderHome();
    showScreen("homeScreen");
    showToast("おつかれさまでした");
  });
  $("saveAreaButton").addEventListener("click", addArea);
  $("taskAreaSelect").addEventListener("change", renderTaskEditor);
  $("saveTasksButton").addEventListener("click", saveTaskEditor);
  $("resetTasksButton").addEventListener("click", resetTaskEditor);
  $("durationGroup").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-duration]");
    if (!button) return;
    selectedDuration = Number(button.dataset.duration);
    document.querySelectorAll("#durationGroup button").forEach((item) => {
      item.classList.toggle("selected", item === button);
    });
  });
  $("beforeInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => setImage($("beforePreview"), src));
  });
  $("quickBeforeInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => setImage($("quickBeforePreview"), src));
  });
  $("summaryBeforeInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => {
      if (!state.session) return;
      state.session.beforeImage = src;
      saveState();
      setImage($("summaryBefore"), src);
      showToast("Before写真を保存しました");
      uploadSessionPhoto("before");
    });
  });
  $("afterInput").addEventListener("change", (event) => {
    readImage(event.target, (src) => {
      if (!state.session) return;
      state.session.afterImage = src;
      saveState();
      setImage($("summaryAfter"), src);
      showToast("After写真を保存しました");
      uploadSessionPhoto("after");
    });
  });
}

bindEvents();
renderHome();

function installApp() {
  if (!deferredInstallPrompt) {
    showToast("Chromeのメニューから「アプリをインストール」を選んでください");
    return;
  }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.finally(() => {
    deferredInstallPrompt = null;
    $("installButton").classList.add("hidden");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("installButton").classList.remove("hidden");
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  $("installButton").classList.add("hidden");
  showToast("片付けナビをインストールしました");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}
