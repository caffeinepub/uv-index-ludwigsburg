import Types "../types/uv-data";
import UVDataLib "../lib/uv-data";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin () {
  let UV_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=48.8936&longitude=9.1920&hourly=uv_index&timezone=Europe%2FBerlin&forecast_days=1";

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Fetch raw UV JSON from Open-Meteo for Ludwigsburg.
  func fetchUVDataJson() : async Text {
    await OutCall.httpGetRequest(UV_API_URL, [], transform);
  };

  /// Returns current UV index and hourly forecast for Ludwigsburg.
  public func getUVData() : async { #ok : Types.UVData; #err : Text } {
    try {
      let json = await fetchUVDataJson();
      let uvData = UVDataLib.buildUVData(json);
      #ok(uvData)
    } catch e {
      #err("Failed to fetch UV data")
    }
  };
};
