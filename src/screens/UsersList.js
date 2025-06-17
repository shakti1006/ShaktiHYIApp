import React, { useEffect, useCallback, useRef } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, incrementPage } from '../features/users/usersSlice';
import UserCard from '../components/UserCard';
import colors from '../theme/colors';
import { heightToDp as hp, widthToDp as wp } from '../store/responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function UsersList({ navigation }) {
  const dispatch = useAppDispatch();
  const { list, loading, error, page, hasNextPage } = useAppSelector(s => s.users);

  // fetch when page changes
  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  // prevent double-fires on momentum scroll
  const onEndReachedCalledDuringMomentum = useRef(true);

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      dispatch(incrementPage());
    }
  }, [dispatch, loading, hasNextPage]);

   if (loading && list.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={wp(8)} color={colors.primary} />
        <Text style={styles.loadingText}>Loading Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={list}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => navigation.navigate('UserModal', { userId: item.id })}
          />
        )}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMore();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            {loading && hasNextPage && <ActivityIndicator />}
            {!hasNextPage && !loading && (
              <Text style={styles.noMore}>No more users.</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity onPress={() => navigation.navigate('UserModal')} style={{width:wp(18),height:wp(18),borderRadius:wp(9),position: 'absolute', right: wp(10), bottom: hp(10), zIndex: 1,backgroundColor:`${colors.primary}`,alignItems: 'center',justifyContent: 'center'}}>
        <Ionicons name="person-add" size={wp(5)} color="#fff" onPress={() => navigation.navigate('UserModal')} />
        <Text style={{color:colors.card,textAlign:'center',paddingLeft:wp(1.5)}}>ADD </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:'#f5f5f5' },
  error: { color: 'red', textAlign: 'center', margin: 8 },
  footer: { padding: 16, alignItems: 'center' },
  noMore: { color: '#666' },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    color: colors.text,
    fontSize: wp(4.5),
    fontFamily: 'QuaternaryFont',
  },
});
