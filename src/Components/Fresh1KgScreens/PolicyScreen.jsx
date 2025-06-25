import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Import your icon libraries
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PolicyScreen = () => {
  const navigation = useNavigation();

  const policies = [
    {
      id: 1,
      iconName: 'eco', // Leaf icon for vegetables
      iconType: 'MaterialIcons',
      title: 'Vegetables',
      subtitle: 'Fresh & Organic, Farm to Table',
      backgroundColor: '#E8F5E8',
      iconColor: '#4CAF50',
      categoryId: 2, // Replace with your actual categoryId number for vegetables
    },
    {
      id: 2,
      iconName: 'apple', // Apple icon for fruits
      iconType: 'FontAwesome',
      title: 'Fruits',
      subtitle: 'Sweet & Juicy, Premium Quality',
      backgroundColor: '#FFF3E0',
      iconColor: '#FF9800',
      categoryId: 1, // Replace with your actual categoryId number for fruits
    },
    {
      id: 3,
      iconName: 'local-florist', // Flower/natural icon for dry fruits
      iconType: 'MaterialIcons',
      title: 'Dry-Fruits',
      subtitle: 'Premium Nuts, Rich in Nutrition',
      backgroundColor: '#F3E5F5',
      iconColor: '#9C27B0',
      categoryId: 3, // Replace with your actual categoryId number for dry-fruits
    },
  ];

  const handlePolicyPress = (policy) => {
    navigation.navigate('ProductsScreen', {
      categoryId: policy.categoryId,
      title: policy.title,
    });
  };

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
          <TouchableOpacity
            key={policy.id}
            style={styles.policyItem}
            onPress={() => handlePolicyPress(policy)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: policy.backgroundColor }]}>
              {renderIcon(policy.iconName, policy.iconType, policy.iconColor, 24)}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{policy.title}</Text>
              <Text style={styles.subtitle}>{policy.subtitle}</Text>
            </View>
            {/* Optional: Add arrow icon to indicate it's clickable */}
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color="#CCCCCC" 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    marginTop: -15,
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