import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Duraciones de cada modo, en minutos
const MODOS = {
  enfoque: { nombre: 'Enfoque', minutos: 25, color: '#E5484D' },
  descanso: { nombre: 'Descanso', minutos: 5, color: '#30A46C' },
};

function formatear(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function App() {
  const [modo, setModo] = useState('enfoque');
  const [restante, setRestante] = useState(MODOS.enfoque.minutos * 60);
  const [corriendo, setCorriendo] = useState(false);
  const [ciclos, setCiclos] = useState(0);
  const intervalo = useRef(null);

  // Cuenta regresiva: resta 1 segundo mientras esté corriendo
  useEffect(() => {
    if (!corriendo) return;
    intervalo.current = setInterval(() => {
      setRestante((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalo.current);
  }, [corriendo]);

  // Al llegar a 0, cambia automáticamente de modo
  useEffect(() => {
    if (restante > 0) return;
    setCorriendo(false);
    if (modo === 'enfoque') {
      setCiclos((c) => c + 1);
      cambiarModo('descanso');
    } else {
      cambiarModo('enfoque');
    }
  }, [restante]);

  function cambiarModo(nuevo) {
    setCorriendo(false);
    setModo(nuevo);
    setRestante(MODOS[nuevo].minutos * 60);
  }

  function reiniciar() {
    setCorriendo(false);
    setRestante(MODOS[modo].minutos * 60);
  }

  const actual = MODOS[modo];

  return (
    <View style={[styles.contenedor, { backgroundColor: actual.color }]}>
      <StatusBar style="light" />

      <Text style={styles.titulo}>Cronómetro Pomodoro</Text>

      {/* Selector de modo */}
      <View style={styles.fila}>
        {Object.keys(MODOS).map((clave) => (
          <Pressable
            key={clave}
            onPress={() => cambiarModo(clave)}
            style={[styles.pestana, modo === clave && styles.pestanaActiva]}
          >
            <Text style={styles.textoPestana}>{MODOS[clave].nombre}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.tiempo}>{formatear(restante)}</Text>

      {/* Controles */}
      <View style={styles.fila}>
        <Pressable
          onPress={() => setCorriendo((c) => !c)}
          style={({ pressed }) => [styles.boton, pressed && { opacity: 0.8 }]}
        >
          <Text style={[styles.textoBoton, { color: actual.color }]}>
            {corriendo ? 'Pausar' : 'Iniciar'}
          </Text>
        </Pressable>
        <Pressable onPress={reiniciar} style={styles.botonSecundario}>
          <Text style={styles.textoPestana}>Reiniciar</Text>
        </Pressable>
      </View>

      <Text style={styles.ciclos}>Pomodoros completados: {ciclos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
  },
  pestana: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  pestanaActiva: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  textoPestana: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  tiempo: {
    color: '#fff',
    fontSize: 120,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 32,
  },
  boton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  textoBoton: {
    fontSize: 22,
    fontWeight: '800',
  },
  botonSecundario: {
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  ciclos: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    marginTop: 32,
  },
});
