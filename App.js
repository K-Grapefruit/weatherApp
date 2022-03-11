import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEYS = "9bd0ff20e935422ed58f91ad13a49da0";

export default function App() {
  const [location, setLocation] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    /* await Location.requestBackgroundPermissionsAsync(); */
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setLocation(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEYS}&units=metric`
    );
    const json = await response.json();
    /* console.log(json.daily); */
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>{location}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        contentContainerStyle={styles.weather}
        indicatorStyle="white"
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large"></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              <Text style={styles.temp}>{day.temp.day.toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinytext}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,

    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 178,
    marginTop: 50,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinytext: {
    fontSize: 20,
  },
});
/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    color: "blue",
  },
});
 */
