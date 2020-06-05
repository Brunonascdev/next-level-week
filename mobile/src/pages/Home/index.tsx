import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import {RectButton} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-community/picker';
import {useNavigation} from '@react-navigation/native';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => uf.sigla);

        return setUfs(ufInitials);
      })
      .catch((err) => {
        return console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!selectedUf) {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then((res) => {
        const cityName = res.data.map((city) => city.nome);

        return setCities(cityName);
      })
      .catch((err) => {
        return console.log(err);
      });
  }, [selectedUf]);

  const navigation = useNavigation();

  const handleNavigateToPoints = () => {
    if (selectedUf !== '0') {
      if (selectedCity !== '0') {
        return navigation.navigate('Points', {
          city: selectedCity,
          uf: selectedUf,
        });
      }
    }
    return Alert.alert('Oops!', 'Insira o estado ou a cidade para prosseguir.');
  };

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{width: 274, height: 368}}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View style={styles.input}>
        <Picker
          selectedValue={selectedUf}
          style={styles.select}
          onValueChange={(itemValue) => setSelectedUf(itemValue)}
          mode="dialog">
          <Picker.Item label="Selecione um estado" value="0" />
          {ufs.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
      <View style={styles.input}>
        <Picker
          selectedValue={selectedCity}
          style={styles.select}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}>
          <Picker.Item label="Selecione uma cidade" value="0" />
          {cities.map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  footer: {},

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu-Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto-Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  select: {
    flex: 1,
    width: 300,
  },

  input: {
    height: 60,
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
});
