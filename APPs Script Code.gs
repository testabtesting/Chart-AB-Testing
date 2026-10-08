function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Responses");

  if (!e || !e.postData || !e.postData.contents) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST data received."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let data;

  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid JSON."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const eventType = data.event || "";

  // Only prevent duplicate RESPONSE submissions.
  // Page views are allowed to occur multiple times.
  if (eventType === "response") {
    const lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      const values = sheet
        .getRange(2, 1, lastRow - 1, 7)
        .getValues();

      const duplicateResponse = values.some(row =>
        row[1] === data.participant_id &&
        row[6] === "response"
      );

      if (duplicateResponse) {
        return ContentService
          .createTextOutput(JSON.stringify({
            status: "duplicate"
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  sheet.appendRow([
    new Date(),
    data.participant_id || "",
    data.group || "",
    data.chart || "",
    data.answer || "",
    data.correct === true ? true :
      data.correct === false ? false : "",
    eventType
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      event: eventType
    }))
    .setMimeType(ContentService.MimeType.JSON);
}