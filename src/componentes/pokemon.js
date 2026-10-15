
import { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppContext } from '../context/AppContext';

export default function Pokemon({ route }) {
  const { nombre } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(false);

  const { favoritos, setFavoritos } = useContext(AppContext);

  useEffect(() => {
    const obtenerPokemon = async () => {
      try {
        setPokemon(null);
        setError(false);

        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${nombre}`
        );

        if (!res.ok) {
          throw new Error('No se encontró el Pokémon');
        }

        const data = await res.json();
        setPokemon(data);
      } catch (e) {
        setError(true);
      }
    };

    obtenerPokemon();
  }, [nombre]);

  if (error) {
    return <Text>No se pudo cargar el Pokémon.</Text>;
  }

  if (!pokemon) {
    return <Text>Cargando...</Text>;
  }

  const esFavorito = favoritos.some(
    (p) => p.id === pokemon.id
  );

  const toggleFavorito = () => {
    if (esFavorito) {
      setFavoritos(
        favoritos.filter((p) => p.id !== pokemon.id)
      );
    } else {
      setFavoritos([
        ...favoritos,
        { id: pokemon.id, nombre: pokemon.name },
      ]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>{pokemon.name}</Text>

        <Image
          source={{
            uri: pokemon.sprites.other['official-artwork']
              .front_default,
          }}
          style={styles.imagen}
        />

        <Text>
          Tipo(s): {pokemon.types.map((t) => t.type.name).join(', ')}
        </Text>

        <Text>
          Altura: {pokemon.height / 10} m
          {' / '}
          Peso: {pokemon.weight / 10} kg
        </Text>

        <TouchableOpacity
          onPress={toggleFavorito}
          style={styles.botonFavorito}
        >
          <Text style={styles.corazon}>
            {esFavorito ? '❤️' : '🤍'}
          </Text>
          <Text>
            {esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  imagen: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  botonFavorito: {
    marginTop: 20,
    alignItems: 'center',
  },
  corazon: {
    fontSize: 32,
  },
});
