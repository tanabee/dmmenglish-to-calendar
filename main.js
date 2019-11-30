function main() {
  var labelName = 'カレンダー登録済';
  var threads = GmailApp.search('from:noreply@eikaiwa.dmm.com subject:レッスン予約 -label:' + labelName)
  threads.forEach(function (thread) {
    var body = thread.getMessages()[0].getPlainBody();
    var date = find(body, '様、', 'の');
    var teacher = find(body, '0の', 'との');
    var url = body.match(/https(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/)[0];
    var start = new Date(date)
    var end = new Date(start.getTime() + 30 * 60 * 1000);
    CalendarApp
      .getDefaultCalendar()
      .createEvent(
        'DMM 英会話 (講師: ' + teacher + ' )',
        start,
        end,
        { location: url }
      );
    var label = GmailApp.getUserLabelByName(labelName);
    thread.addLabel(label);
  })
}

/** 
 * 特定の文字列の間に挟まれた文字列を抽出する
 * @param { string } text 検索対象となる文字列
 * @param { string } from 前方の文字列
 * @param { string } to   後方の文字列
 * @return { string } 検索結果
 */
function find(text, from, to) {
  var fromIndex = text.indexOf(from);
  if (fromIndex === -1) return '';
  text = text.substring(fromIndex + from.length);
  var toIndex = text.indexOf(to);
  if (toIndex === -1) return '';
  return text.substring(0, toIndex);
}
