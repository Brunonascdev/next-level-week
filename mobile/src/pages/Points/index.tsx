import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    api.get('items').then((res) => {
      setItems(res.data);
    });
  }, []);

  useEffect(() => {
    const loadPosition = async () => {
      const {status} = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Oops...',
          'Precisamos de sua permissão para obter a sua localização.',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const {latitude, longitude} = location.coords;

      setInitialPosition([latitude, longitude]);
    };

    loadPosition();
  }, []);

  useEffect(() => {
    api
      .get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then((res) => {
        setPoints(res.data);
      });
  }, [selectedItems]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigateToDetails = (id: number) => {
    navigation.navigate('Detail', {point_id: id});
  };

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      return setSelectedItems(filteredItems);
    }

    return setSelectedItems([...selectedItems, id]);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={25} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 ? (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}>
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetails(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_url,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          ) : (
            <View style={styles.alignActivityOnCenter}>
              <ActivityIndicator size="large" color="#34CB79" />
            </View>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20}}>
          {items.map((item) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
              key={String(item.id)}>
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  alignActivityOnCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
