import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import navStyles from '../styles/barraNavegacao';

export default function dashboard() {
    <View style={navStyles.tabBar}>
            <TouchableOpacity
              style={navStyles.tabItem}
              onPress={() => router.push('/inicial')}
              activeOpacity={0.8}
            >
              <Icon name="home" size={32} color="#ffffff" />
              <Text style={navStyles.tabLabel}>Início</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              style={navStyles.tabItem}
              onPress={() => router.push('/auth/boasVindas')}
              activeOpacity={0.8}
            >
              <Icon name="swap-horiz" size={32} color="#ffffff" />
              <Text style={navStyles.tabLabel}>Fluxo Financeiro</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              style={navStyles.tabItem}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Icon name="add-circle" size={56} color="rgb(255, 255, 255)" />
            </TouchableOpacity>
            <TouchableOpacity
              style={navStyles.tabItem}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Icon name="radar" size={32} color="#ffffff" />
              <Text style={navStyles.tabLabel}>Metas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={navStyles.tabItem}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Icon name="menu" size={32} color="#ffffff" />
              <Text style={navStyles.tabLabel}>mais</Text>
            </TouchableOpacity>
          </View>
}