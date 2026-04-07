import Types "../types/uv-data";
import List "mo:core/List";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {

  // ─── Internal helpers ────────────────────────────────────────────────────

  /// Find the content between the first `[` and matching `]` after `needle` in `json`.
  func extractArrayField(json : Text, fieldName : Text) : ?Text {
    let needle = "\"" # fieldName # "\":[";
    switch (findAfter(json, needle)) {
      case null {
        let needle2 = "\"" # fieldName # "\": [";
        switch (findAfter(json, needle2)) {
          case null null;
          case (?rest) ?upToCloseBracket(rest);
        }
      };
      case (?rest) ?upToCloseBracket(rest);
    }
  };

  /// Return the substring of `text` that follows `prefix`, or null if not found.
  func findAfter(text : Text, prefix : Text) : ?Text {
    let prefixSize = prefix.size();
    let textSize = text.size();
    if (prefixSize > textSize) return null;
    // iterate character by character checking for prefix
    let textChars = text.toArray();
    let prefixChars = prefix.toArray();
    var i = 0;
    while (i + prefixSize <= textSize) {
      var match = true;
      var k = 0;
      while (k < prefixSize and match) {
        if (textChars[i + k] != prefixChars[k]) { match := false };
        k += 1;
      };
      if (match) {
        // build substring starting at i + prefixSize
        let result = List.empty<Char>();
        var j = i + prefixSize;
        while (j < textSize) {
          result.add(textChars[j]);
          j += 1;
        };
        return ?Text.fromIter(result.values());
      };
      i += 1;
    };
    null
  };

  /// Return the content of `text` up to the first `]` character.
  func upToCloseBracket(text : Text) : Text {
    let chars = text.toArray();
    let result = List.empty<Char>();
    var i = 0;
    while (i < chars.size()) {
      let c = chars[i];
      if (c == ']') {
        i := chars.size(); // break
      } else {
        result.add(c);
        i += 1;
      };
    };
    Text.fromIter(result.values())
  };

  /// Split a JSON array string (without surrounding `[` `]`) into individual element texts.
  /// Handles quoted strings and bare numbers.
  func splitJsonArray(arrayContent : Text) : [Text] {
    let items = List.empty<Text>();
    let parts = arrayContent.split(#char ',');
    for (part in parts) {
      // trim whitespace and quotes
      let t1 = part.trim(#text " ").trim(#text "\n").trim(#text "\r").trim(#text "\t");
      let trimmed = t1.trim(#text "\"");
      if (not trimmed.isEmpty()) {
        items.add(trimmed);
      };
    };
    items.toArray()
  };

  /// Parse a Float from text (e.g. "3.14", "10", "-0.5"), returning 0.0 on failure.
  /// Handles integers and decimals. Does not handle scientific notation.
  func parseFloat(t : Text) : Float {
    let trimmed = t.trim(#text " ").trim(#text "\n").trim(#text "\r");
    if (trimmed.isEmpty()) return 0.0;
    // handle negative
    let (negative, body) = if (trimmed.startsWith(#text "-")) {
      (true, switch (trimmed.stripStart(#text "-")) { case (?s) s; case null "" })
    } else {
      (false, trimmed)
    };
    // split on "."
    let parts = body.split(#char '.').toArray();
    let intPart : Float = switch (Nat.fromText(parts[0])) {
      case (?n) n.toFloat();
      case null 0.0;
    };
    let fracPart : Float = if (parts.size() > 1) {
      let fracText = parts[1];
      let fracLen = fracText.size();
      switch (Nat.fromText(fracText)) {
        case (?n) {
          var divisor : Float = 1.0;
          var i = 0;
          while (i < fracLen) { divisor := divisor * 10.0; i += 1 };
          n.toFloat() / divisor
        };
        case null 0.0;
      }
    } else { 0.0 };
    let result = intPart + fracPart;
    if (negative) { -result } else { result }
  };

  /// Get the current hour formatted as "T%02d:00" to match Open-Meteo time entries (UTC+1 Berlin).
  /// Open-Meteo returns local times for timezone=Europe/Berlin (+1 in winter, +2 in summer).
  /// We approximate by using UTC+1 (CET). For production accuracy the frontend should handle matching.
  func currentHourText() : Text {
    let nowNs : Int = Time.now();
    let nowSec : Int = nowNs / 1_000_000_000;
    // hour in UTC
    let totalHours : Int = nowSec / 3600;
    let hourUTC : Int = ((totalHours % 24) + 24) % 24;
    // apply UTC+1 (CET) offset — close enough for display purposes
    let hourLocal : Int = (hourUTC + 1) % 24;
    let hText = if (hourLocal < 10) { "0" # hourLocal.toText() } else { hourLocal.toText() };
    "T" # hText # ":00"
  };

  // ─── Public functions ─────────────────────────────────────────────────────

  /// Parse the current UV index from the raw JSON response.
  /// Returns null if parsing fails.
  public func parseCurrentUVIndex(json : Text) : ?Float {
    switch (extractArrayField(json, "uv_index")) {
      case null null;
      case (?arrayContent) {
        let values = splitJsonArray(arrayContent);
        switch (extractArrayField(json, "time")) {
          case null {
            if (values.size() > 0) { ?parseFloat(values[0]) } else null
          };
          case (?timeContent) {
            let times = splitJsonArray(timeContent);
            let targetHour = currentHourText();
            var foundIdx : ?Nat = null;
            var i = 0;
            while (i < times.size()) {
              if (times[i].contains(#text targetHour)) {
                foundIdx := ?i;
                i := times.size(); // break
              } else {
                i += 1;
              };
            };
            switch (foundIdx) {
              case null {
                if (values.size() > 0) { ?parseFloat(values[0]) } else null
              };
              case (?idx) {
                if (idx < values.size()) { ?parseFloat(values[idx]) } else null
              };
            }
          };
        }
      };
    }
  };

  /// Parse next 12 hours of hourly forecast from raw JSON response.
  public func parseHourlyForecast(json : Text) : [Types.HourlyForecastEntry] {
    let timesOpt = extractArrayField(json, "time");
    let valuesOpt = extractArrayField(json, "uv_index");
    switch (timesOpt, valuesOpt) {
      case (?timeContent, ?uvContent) {
        let times = splitJsonArray(timeContent);
        let uvValues = splitJsonArray(uvContent);
        let targetHour = currentHourText();
        var startIdx = 0;
        var i = 0;
        while (i < times.size()) {
          if (times[i].contains(#text targetHour)) {
            startIdx := i;
            i := times.size(); // break
          } else {
            i += 1;
          };
        };
        let entries = List.empty<Types.HourlyForecastEntry>();
        var j = startIdx;
        var count = 0;
        while (j < times.size() and count < 12) {
          if (j < uvValues.size()) {
            entries.add({
              time = times[j];
              uvIndex = parseFloat(uvValues[j]);
            });
          };
          j += 1;
          count += 1;
        };
        entries.toArray()
      };
      case _ { [] };
    }
  };

  /// Determine risk level label from a UV index value.
  public func getRiskLevel(uvIndex : Float) : Text {
    if (uvIndex < 3.0) { "Low" }
    else if (uvIndex < 6.0) { "Moderate" }
    else if (uvIndex < 8.0) { "High" }
    else if (uvIndex < 11.0) { "Very High" }
    else { "Extreme" }
  };

  /// Build a full UVData record from a raw JSON response.
  public func buildUVData(json : Text) : Types.UVData {
    let currentUVIndex = switch (parseCurrentUVIndex(json)) {
      case (?v) v;
      case null 0.0;
    };
    let hourlyForecast = parseHourlyForecast(json);
    let currentRiskLevel = getRiskLevel(currentUVIndex);
    let nowNs : Int = Time.now();
    let nowSec : Int = nowNs / 1_000_000_000;
    {
      currentUVIndex;
      currentRiskLevel;
      hourlyForecast;
      lastUpdated = nowSec.toText() # "s";
    }
  };

};
