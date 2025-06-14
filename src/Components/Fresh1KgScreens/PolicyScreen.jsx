import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
// Import your icon libraries
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PolicyScreen = () => {
  const policies = [
    {
      id: 1,
      iconName: 'widgets',
      iconType: 'MaterialIcons',
      title: 'Wide Assortment',
      subtitle: 'Huge Variety, Great Selection',
      backgroundColor: '#E8F5E8',
      iconColor: '#4CAF50',
    },
    {
      id: 2,
      iconName: 'refresh-cw',
      iconType: 'Feather',
      title: 'Easy Return Policy',
      subtitle: 'Easy Returns, No Worries',
      backgroundColor: '#E8F5E8',
      iconColor: '#4CAF50',
    },
    {
      id: 3,
      iconName: 'dollar-sign',
      iconType: 'Feather',
      title: 'Best Prices & Offers',
      subtitle: 'Exclusive Deals, Best Rates',
      backgroundColor: '#E8F5E8',
      iconColor: '#4CAF50',
    },
    {
      id: 4,
      iconName: 'headphones',
      iconType: 'FontAwesome',
      title: 'Support 24/7',
      subtitle: 'Nonstop Help, Always On',
      backgroundColor: '#E8F5E8',
      iconColor: '#4CAF50',
    },
  ];

  const renderIcon = (iconName, iconType, color, size = 24) => {
    const IconComponent = {
      MaterialIcons: MaterialIcons,
      Feather: Feather,
      FontAwesome: FontAwesome,
    }[iconType];

    if (!IconComponent) {
      return null;
    }

    return (
      <IconComponent 
        name={iconName} 
        size={size} 
        color={color} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {policies.map((policy) => (
          <View key={policy.id} style={styles.policyItem}>
            <View style={[styles.iconContainer, { backgroundColor: policy.backgroundColor }]}>
              {renderIcon(policy.iconName, policy.iconType, policy.iconColor, 24)}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{policy.title}</Text>
              <Text style={styles.subtitle}>{policy.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    marginTop:-15,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 25,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default PolicyScreen;