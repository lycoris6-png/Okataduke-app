# おかたづけ一手

ADHD傾向のあるユーザー向けに、片付けの「次にやる1手」だけを提示するWebアプリです。

## 使い方

`index.html` をブラウザで開くと動きます。インストールやサーバー起動は不要です。

スマホでは `index.html` のままレスポンシブ表示になります。デスクトップ上でスマホ幅の見た目を確認したい場合は `mobile.html` を開いてください。

## MVP実装内容

- 今日の片付けモード選択
- エリアタイルを押して即セッション開始
- エリアごとに専用の片付け候補を提示
- 次にやる1手の提示
- やった、スキップ、保留、もう1回
- Before / After 写真のローカル保存
- 前回セッションの再開
- エリア登録とエリア別進捗
- 2分、5分、10分の片付けセッション
- 控えめな完了演出
- スマホ用下部ナビゲーション
- ホーム画面追加用の `manifest.webmanifest`
- Google DriveへのBefore / After写真アップロード
- 生成したちびキャラ素材を使ったヘッダー背景、実行画面、完了画面、コーチ吹き出し

基本データはブラウザの `localStorage` を使っています。Google Drive接続後は、Before / After写真をDriveにもアップロードできます。

## Google Drive保存の準備

Google CloudでOAuth 2.0のWebクライアントIDを作成し、JavaScriptの承認済み生成元に公開先URLを追加してください。

ローカル確認では `http://localhost`、GitHub Pagesでは `https://ユーザー名.github.io` を追加します。

Google認証は `file://` で開いたページでは動きにくいため、Drive保存を確認するときはlocalhostサーバーかGitHub Pagesで開いてください。
