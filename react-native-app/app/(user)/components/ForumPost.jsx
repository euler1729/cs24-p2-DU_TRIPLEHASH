import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../../assets/configs.json';
import { FontAwesome } from '@expo/vector-icons';

const ForumPost = ({ post }) => {
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{post}</Text>
    </View>
  );
};

const Forum = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);

  const handlePost = () => {
    if (newPost.trim() === '') {
      Alert.alert('Error', 'Please enter a valid post');
      return;
    }
    setPosts([...posts, newPost]);
    setNewPost('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.postsContainer}>
        {posts.map((post, index) => (
          <ForumPost key={index} post={post} />
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={newPost}
          onChangeText={setNewPost}
          placeholder="Write your post here..."
          multiline
          style={styles.input}
        />
        <TouchableOpacity onPress={handlePost} style={styles.postButton}>
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  postContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  postContent: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
  },
});

export default Forum;
