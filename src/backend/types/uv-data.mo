module {
  public type HourlyForecastEntry = {
    time : Text;
    uvIndex : Float;
  };

  public type UVData = {
    currentUVIndex : Float;
    currentRiskLevel : Text;
    hourlyForecast : [HourlyForecastEntry];
    lastUpdated : Text;
  };
};
