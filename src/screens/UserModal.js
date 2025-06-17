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
  // Validation regexes
  const Eml = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const mob = /^[6-9]\d{9}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  const { userId } = route.params || {};
  const dispatch = useAppDispatch();
  const existing = useAppSelector((s) =>
    s.users.list.find((u) => u.id === userId)
  );

  // Build our payload object
  const buildPayload = (values) => ({
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: {
      suite: values.suite.trim(),
      street: values.street.trim(),
      city: values.city.trim(),
    },
  });

  // Handles both create & update
  const handleSubmit = async (values) => {
    // 1. Name
    if (!values.name.trim()) {
      ToastAndroid.show('Name is required.', ToastAndroid.SHORT);
      return;
    }
    if (!nameRegex.test(values.name)) {
      ToastAndroid.show(
        'Name can only contain letters and spaces.',
        ToastAndroid.SHORT
      );
      return;
    }

    // 2. Email
    if (!values.email.trim()) {
      ToastAndroid.show('Email is required.', ToastAndroid.SHORT);
      return;
    }
    if (!Eml.test(values.email)) {
      ToastAndroid.show(
        'Please enter a valid email address.',
        ToastAndroid.SHORT
      );
      return;
    }

    // 3. Phone
    if (!values.phone.trim()) {
      ToastAndroid.show('Mobile number is required.', ToastAndroid.SHORT);
      return;
    }
    if (values.phone.length !== 10) {
      ToastAndroid.show(
        'Mobile number must be exactly 10 digits long.',
        ToastAndroid.SHORT
      );
      return;
    }
    if (!mob.test(values.phone)) {
      ToastAndroid.show(
        'Please enter a valid mobile number (6–9 start).',
        ToastAndroid.SHORT
      );
      return;
    }

    // 4. Suite
    if (!values.suite.trim()) {
      ToastAndroid.show('Suite is required.', ToastAndroid.SHORT);
      return;
    }

    // 5. Street
    if (!values.street.trim()) {
      ToastAndroid.show('Street is required.', ToastAndroid.SHORT);
      return;
    }

    // 6. City
    if (!values.city.trim()) {
      ToastAndroid.show('City is required.', ToastAndroid.SHORT);
      return;
    }
    if (!nameRegex.test(values.city)) {
      ToastAndroid.show(
        'City can only contain letters and spaces.',
        ToastAndroid.SHORT
      );
      return;
    }

    // All checks passed — build and dispatch
    const base = buildPayload(values);
    try {
      if (existing) {
        // Update flow
        await dispatch(
          updateUser({ id: existing.id, ...base })
        ).unwrap();
      } else {
        // Create flow
        await dispatch(createUser(base)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      ToastAndroid.show(
        'Error saving user. Please try again.',
        ToastAndroid.SHORT
      );
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
          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={values.name}
            onChangeText={handleChange('name')}
          />

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={values.email}
            onChangeText={handleChange('email')}
          />

          {/* Phone */}
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            maxLength={10}
            value={values.phone}
            onChangeText={handleChange('phone')}
          />

          {/* Suite */}
          <TextInput
            style={styles.input}
            placeholder="Suite"
            value={values.suite}
            onChangeText={handleChange('suite')}
          />

          {/* Street */}
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={values.street}
            onChangeText={handleChange('street')}
          />

          {/* City */}
          <TextInput
            style={styles.input}
            placeholder="City"
            value={values.city}
            onChangeText={handleChange('city')}
          />

          {/* Buttons */}
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
                onPress={async () => {
                  await dispatch(deleteUser(existing.id)).unwrap();
                  navigation.goBack();
                }}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.updateBtn]}
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
    marginBottom: hp(1.5),
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
    // marginRight: wp(2),
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
