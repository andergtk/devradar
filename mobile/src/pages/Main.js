import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    (async function() {
      requestPermissionsAsync().then(({ granted }) => {
        if (granted) {
          getCurrentPositionAsync({ enableHighAccuracy: true }).then(({ coords }) => {
            const { latitude, longitude } = coords;
    
            setCurrentRegion({
              latitude,
              longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04
            });
          });
        }
      });
    })();
  }, []);

  if (!currentRegion)
    return null;

  async function loadDevs() {
    try {
      const { latitude, longitude } = currentRegion;

      const response = await api.get('/search', {
        params: {
          latitude,
          longitude,
          techs: techs
        }
      });

      setDevs(response.data.result);
    } catch (ex) {
      Alert.alert('Falha na conexão', 'Ocorreu um erro inesperado');
    }
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}
          >
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

            <Callout onPress={() => {
              navigation.navigate('Profile', {
                github_username: dev.github_username
              });
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                {dev.bio && <Text style={styles.devBio}>{dev.bio}</Text>}
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por tecnologias"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrent={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.searchButton}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24
  },

  callout: {
    width: 220
  },

  devName: {
    fontWeight: 'bold'
  },
  
  devBio: {
    color: '#999',
    fontSize: 14
  },

  devTechs: {
    fontSize: 14
  },

  searchForm: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    right: 20,
    left: 20
  },

  searchInput: {
    flex: 1,
    height: 50,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 25,
    elevation: 3
  },

  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 16,
    backgroundColor: '#7D40E7'
  }
});

export default Main;