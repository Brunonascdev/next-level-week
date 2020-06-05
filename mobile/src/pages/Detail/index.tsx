import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import {RectButton} from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail: React.FC = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then((res) => {
      setData(res.data);
    });
  }, []);

  console.log(route.params);

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  };

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
    );
  };

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={25} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image_url,
          }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map((item) => item.title).join(', ')}
        </Text>

        <View>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesomeIcons name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 40,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu-Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto-Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderColor: '#999',
    paddingBottom: 10,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});
