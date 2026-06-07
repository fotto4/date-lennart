function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var calendar = CalendarApp.getDefaultCalendar();
    var timezone = data.timezone || Session.getScriptTimeZone() || "Europe/Berlin";
    var start = new Date(data.date + "T" + data.time + ":00");
    var end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    var dateLabel = Utilities.formatDate(start, timezone, "dd.MM.yyyy");
    var timeLabel = Utilities.formatDate(start, timezone, "HH:mm");

    calendar.createEvent("Date 💌 - " + data.food, start, end, {
      description: [
        "Date vereinbart 💌",
        "Datum: " + dateLabel,
        "Uhrzeit: " + timeLabel + " Uhr",
        "Essen: " + data.food
      ].join("\n")
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
