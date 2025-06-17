import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { heightToDp as hp, widthToDp as wp } from '../store/responsive';
import colors from '../theme/colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserCard = React.memo(({ user, onPress }) => (
  // console.log('Rendering UserCard:', user),
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' ,justifyContent: 'space-between',marginBottom: hp(1)}}>
      <Text style={styles.name}>{user?.name}</Text>
      <EvilIcons name="chevron-right" size={hp(4.5)} color="#909090" style={{ bottom: 4 }} />
    </View>
    <View style={styles.cardView}>
      <FontAwesome name="phone" size={hp(2.5)} color={colors.text}/>
      <Text style={styles.cardText}>{user?.phone}</Text>
    </View>
    <View style={styles.cardView}>
      <MaterialIcons name="email" size={hp(2.5)} color={colors.text}/>
      <Text style={styles.cardText}>{user?.email}</Text>
    </View>
    <View style={styles.cardView}>
      <Ionicons name="location-sharp" size={hp(2.5)} color={colors.text}/>
      <Text style={styles.cardText}>{user?.address?.suite}, {user?.address?.street}, {user?.address?.city}</Text>
    </View>
  </TouchableOpacity>
));

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({
      suite: PropTypes.string,
      street: PropTypes.string,
      city: PropTypes.string,
    }),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    width: wp(90),
    minHeight: hp(15),
    marginVertical: hp(1),
    padding: hp(2),
    marginHorizontal: wp(5),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    elevation: hp(0.2),
  },
  name: { fontSize: 16, fontWeight: 'bold',color: '#333' },
  cardView: { width:wp(80),height:hp(3),flexDirection: 'row', alignItems: 'center'},
  cardText: { fontSize: hp(1.8), color: `${colors.fade}`, textAlign:'center',paddingLeft: wp(2),paddingBottom: hp(0.5)},
});

export default UserCard;
