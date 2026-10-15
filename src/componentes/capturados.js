
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Capturados() {
  const totalPokes = 1025;

  const [listaCapturados, setListaCapturados] = useState([]);
  const [pokemones, setPokemones] = useState([]);
  const [nuevos, setNuevos] = useState([]);

  const navigation = useNavigation();

  const espacio = Array.from(
    { length: totalPokes },
    (_, i) => i + 1
  );

  useEffect(() => {
    const cargarCapturados = async () => {
      try {
        const guardados = await AsyncStorage.getItem('misNumeros');

        if (guardados) {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed)) {
            setListaCapturados([...new Set(parsed.map(Number))]);
          }
        }
      } catch (error) {
        console.log('Error al cargar capturados:', error);
      }
    };

    cargarCapturados();
  }, []);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((res) => res.json())
      .then((datos) => setPokemones(datos.results))
      .catch((error) => console.log('Error al cargar Pokémon:', error));
  }, []);

  const capturarAleatorios = async () => {
    const seleccionados = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * totalPokes) + 1
    );

    const vistos = new Set(listaCapturados);

    const resultados = seleccionados.map((id) => {
      const repetido = vistos.has(id);
      vistos.add(id);
      return { id, repetido };
    });

    const actualizados = [...vistos];

    setListaCapturados(actualizados);
    setNuevos(resultados);

    try {
      await AsyncStorage.setItem(
        'misNumeros',
        JSON.stringify(actualizados)
      );
    } catch (error) {
      console.log('Error al guardar capturados:', error);
    }
  };

  const irADetalle = (id) => {
    const nombre = pokemones[id - 1]?.name || String(id);
    navigation.navigate('Pokemon', { nombre });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Colección</Text>

      <Text style={styles.contador}>
        {listaCapturados.length} / {totalPokes}
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={capturarAleatorios}
        disabled={listaCapturados.length >= totalPokes}
      >
        <Text style={styles.botonTexto}>4 nuevos</Text>
      </TouchableOpacity>

      {nuevos.length > 0 && (
        <>
          <Text style={styles.subtitulo}>Tus nuevos Pokémon</Text>

          <View style={styles.nuevosContainer}>
            {nuevos.map(({ id, repetido }, indice) => (
              <TouchableOpacity
                key={`${id}-${indice}`}
                style={[
                  styles.nuevoCard,
                  repetido && styles.nuevoRepetido,
                ]}
                onPress={() => irADetalle(id)}
              >
                <Text>{id}</Text>

                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                  }}
                  style={styles.nuevoImagen}
                />

                <Text numberOfLines={1} style={styles.nuevoNombre}>
                  {pokemones[id - 1]?.name || ''}
                </Text>

                {repetido && <Text>Repetido</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.subtitulo}>Álbum</Text>

      <View style={styles.albumGrid}>
        {espacio.map((id) => {
          const capturado = listaCapturados.includes(id);

          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.albumItem,
                capturado ? styles.capturado : styles.noCapturado,
              ]}
              onPress={() => capturado && irADetalle(id)}
              disabled={!capturado}
            >
              {capturado && (
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                  }}
                  style={styles.albumImagen}
                />
              )}

              <Text style={styles.albumId}>{id}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  contador: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#007bff',
  },
  boton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#444',
  },
  nuevosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nuevoCard: {
    width: '23%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#28a745',
    marginBottom: 8,
  },
  nuevoRepetido: {
    borderColor: '#ffc107',
    backgroundColor: '#fffdf0',
  },
  nuevoImagen: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  nuevoNombre: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6,
    paddingBottom: 30,
  },
  albumItem: {
    width: '18%',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 6,
  },
  capturado: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
    borderWidth: 1,
  },
  noCapturado: {
    backgroundColor: '#eee',
  },
  albumImagen: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  albumId: {
    fontSize: 10,
    color: '#555',
  },
});
