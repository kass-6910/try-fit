import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Rajdhani_700Bold } from '@expo-google-fonts/rajdhani';

// ----- Design tokens TryFit -----
const COLORS = {
  bg: '#0A0A0A',          // fond principal
  card: '#161616',        // cartes
  cardBorder: '#222222',
  green: '#22C55E',       // vert TryFit
  greenDark: 'rgba(34, 197, 94, 0.12)', // fonds d'icônes verts
  orange: '#F97316',
  orangeDark: 'rgba(249, 115, 22, 0.12)',
  yellow: '#EAB308',
  yellowDark: 'rgba(234, 179, 8, 0.12)',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  navBg: '#111111',
};

// ----- Données mockées (à remplacer par l'API du back) -----
const MOCK_USER = {
  firstName: 'Gouacem',
  hasUnreadNotifications: true,
  nextCourse: null, // objet cours ou null si rien de réservé
  stats: {
    sessionsThisMonth: 12,
    streakDays: 5,
    bookedCourses: 3,
    avgDuration: '1h15',
  },
};

export default function HomeScreen({ navigation, user = MOCK_USER }) {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Rajdhani_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/logo_tryfit.jpeg')}
              style={styles.logo}
            />
            <View>
              <Text style={styles.welcomeLabel}>Bienvenue,</Text>
              <Text style={styles.welcomeName}>{user.firstName} 👋</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation?.navigate?.('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            {user.hasUnreadNotifications && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* ---------- Prochain cours ---------- */}
        <Text style={styles.sectionTitle}>PROCHAIN COURS</Text>

        {user.nextCourse ? (
          <View style={styles.nextCourseCard}>
            <Text style={styles.nextCourseName}>{user.nextCourse.name}</Text>
            <Text style={styles.nextCourseInfo}>
              {user.nextCourse.day} · {user.nextCourse.time} · {user.nextCourse.coach}
            </Text>
          </View>
        ) : (
          <View style={styles.nextCourseCard}>
            <Text style={styles.emptyText}>Aucun cours réservé prochainement</Text>
            <TouchableOpacity
              style={styles.bookRow}
              onPress={() => navigation?.navigate?.('Cours')}
            >
              <Text style={styles.bookLink}>Réserver un cours</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.green} />
            </TouchableOpacity>
          </View>
        )}

        {/* ---------- Statistiques ---------- */}
        <Text style={styles.sectionTitle}>VOS STATISTIQUES</Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<Ionicons name="flame" size={22} color={COLORS.orange} />}
            iconBg={COLORS.orangeDark}
            value={String(user.stats.sessionsThisMonth)}
            label="séances"
            sublabel="Ce mois"
          />
          <StatCard
            icon={<Ionicons name="trophy" size={22} color={COLORS.yellow} />}
            iconBg={COLORS.yellowDark}
            value={String(user.stats.streakDays)}
            label="jours"
            sublabel="Série"
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="calendar-check"
                size={22}
                color={COLORS.green}
              />
            }
            iconBg={COLORS.greenDark}
            value={String(user.stats.bookedCourses)}
            label="cours"
            sublabel="Réservés"
          />
          <StatCard
            icon={<Ionicons name="time-outline" size={22} color={COLORS.green} />}
            iconBg={COLORS.greenDark}
            value={user.stats.avgDuration}
            label="Durée moy."
          />
        </View>
      </ScrollView>

      {/* ---------- Bouton QR flottant (déverrouillage porte) ---------- */}
      <TouchableOpacity
        style={styles.qrButton}
        activeOpacity={0.85}
        onPress={() => navigation?.navigate?.('QRScanner')}
      >
        <Ionicons name="qr-code" size={26} color={COLORS.bg} />
      </TouchableOpacity>

      {/* ---------- Bottom navigation ---------- */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Accueil" active />
        <NavItem
          icon="calendar-outline"
          label="Cours"
          onPress={() => navigation?.navigate?.('Cours')}
        />
        <NavItem
          icon="person-outline"
          label="Profil"
          onPress={() => navigation?.navigate?.('Profil')}
        />
      </View>
    </SafeAreaView>
  );
}

// ----- Carte statistique -----
function StatCard({ icon, iconBg, value, label, sublabel }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>
        <Text style={styles.statLabelStrong}>{label}</Text>
        {sublabel ? <Text> {sublabel}</Text> : null}
      </Text>
    </View>
  );
}

// ----- Item de la bottom nav -----
function NavItem({ icon, label, active = false, onPress }) {
  const color = active ? COLORS.green : COLORS.textMuted;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View style={[styles.navIconWrap, active && styles.navIconActive]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.navLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120, // espace pour la nav + bouton QR
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
  },
  welcomeLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  welcomeName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: COLORS.text,
    lineHeight: 26,
  },
  bellButton: {
    padding: 6,
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Sections
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    marginBottom: 12,
    marginTop: 8,
  },

  // Prochain cours
  nextCourseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    padding: 20,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: COLORS.green,
  },
  nextCourseName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 4,
  },
  nextCourseInfo: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // Statistiques
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 18,
    width: '47%',
    flexGrow: 1,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  statValue: {
    fontFamily: 'Rajdhani_700Bold',
    fontSize: 32,
    color: COLORS.text,
    lineHeight: 36,
  },
  statLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  statLabelStrong: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#D1D5DB',
  },

  // Bouton QR flottant
  qrButton: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.green,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.navBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 10,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: COLORS.greenDark,
  },
  navLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
  },
});