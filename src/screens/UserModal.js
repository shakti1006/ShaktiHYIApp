// src/screens/UserModal.js
import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import {
  createUser,
  updateUser,
  deleteUser,
} from '../features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import colors from '../theme/colors';
import { heightToDp as hp, widthToDp as wp } from '../store/responsive';

export default function UserModal({ route, navigation }) {
  // Regex validations
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  const { userId } = route.params || {};
  const dispatch = useAppDispatch();
  const userList = useAppSelector(s => s.users.list);
  const existing = userList.find(u => u.id === userId);

  // Build the payload object
  const buildPayload = values => ({
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: {
      suite: values.suite.trim(),
      street: values.street.trim(),
      city: values.city.trim(),
    },
  });

  // Combined submit handler
  const handleSubmit = async values => {
    // 1) Name
    if (!values.name.trim()) {
      ToastAndroid.show('Name is required.', ToastAndroid.SHORT);
      return;
    }
    if (!nameRegex.test(values.name)) {
      ToastAndroid.show('Name can only contain letters.', ToastAndroid.SHORT);
      return;
    }

    // 2) Email
    const email = values.email.trim();
    if (!email) {
      ToastAndroid.show('Email is required.', ToastAndroid.SHORT);
      return;
    }
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Enter a valid email.', ToastAndroid.SHORT);
      return;
    }
    // duplicate email?
    if (userList.some(u => u.email === email && (existing ? u.id !== existing.id : true))) {
      ToastAndroid.show('Email already exists.', ToastAndroid.SHORT);
      return;
    }

    // 3) Phone
    const phone = values.phone.trim();
    if (!phone) {
      ToastAndroid.show('Phone is required.', ToastAndroid.SHORT);
      return;
    }
    if (!phoneRegex.test(phone)) {
      ToastAndroid.show('Enter a valid 10-digit mobile starting 6–9.', ToastAndroid.SHORT);
      return;
    }
    // duplicate phone?
    if (userList.some(u => u.phone === phone && (existing ? u.id !== existing.id : true))) {
      ToastAndroid.show('Mobile number already exists.', ToastAndroid.SHORT);
      return;
    }

    // 4) Suite
    if (!values.suite.trim()) {
      ToastAndroid.show('Suite is required.', ToastAndroid.SHORT);
      return;
    }

    // 5) Street
    if (!values.street.trim()) {
      ToastAndroid.show('Street is required.', ToastAndroid.SHORT);
      return;
    }

    // 6) City
    if (!values.city.trim()) {
      ToastAndroid.show('City is required.', ToastAndroid.SHORT);
      return;
    }
    if (!nameRegex.test(values.city)) {
      ToastAndroid.show('City can only contain letters.', ToastAndroid.SHORT);
      return;
    }

    // Build and dispatch
    const payload = buildPayload(values);
    try {
      if (existing) {
        await dispatch(updateUser({ id: existing.id, ...payload })).unwrap();
        ToastAndroid.show('User edited successfully', ToastAndroid.SHORT);
      } else {
        await dispatch(createUser(payload)).unwrap();
        ToastAndroid.show('User added successfully', ToastAndroid.SHORT);
      }
      navigation.goBack();
    } catch (err) {
      ToastAndroid.show('Error saving user. Please try again.', ToastAndroid.SHORT);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(existing.id)).unwrap();
      ToastAndroid.show('User deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch {
      ToastAndroid.show('Error deleting user. Please try again.', ToastAndroid.SHORT);
    }
  };

  return (
    <Formik
      initialValues={{
        name: existing?.name || '',
        email: existing?.email || '',
        phone: existing?.phone || '',
        suite: existing?.address?.suite || '',
        street: existing?.address?.street || '',
        city: existing?.address?.city || '',
      }}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={values.name}
            onChangeText={handleChange('name')}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={values.email}
            onChangeText={handleChange('email')}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            maxLength={10}
            value={values.phone}
            onChangeText={handleChange('phone')}
          />

          <TextInput
            style={styles.input}
            placeholder="Suite"
            value={values.suite}
            onChangeText={handleChange('suite')}
          />

          <TextInput
            style={styles.input}
            placeholder="Street"
            value={values.street}
            onChangeText={handleChange('street')}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={values.city}
            onChangeText={handleChange('city')}
          />

          {existing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.updateBtn]}
                onPress={handleSubmit}
              >
                <Text style={styles.btnText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={handleDelete}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[ styles.updateBtn]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Create</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2),
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.fade,
    borderRadius: 4,
    padding: hp(1.5),
    marginBottom: hp(1),
    fontSize: wp(4),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  btn: {
    flex: 1,
    padding: hp(1.5),
    borderRadius: 4,
    alignItems: 'center',
  },
  updateBtn: {
    backgroundColor: colors.primary,
    padding: hp(1.5),
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: 'red',
    marginLeft: wp(2),
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
});
