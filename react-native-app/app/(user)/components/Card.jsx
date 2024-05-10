import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share, TextInput, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you have FontAwesome icons available

const Card = ({ post }) => {
    const { userAvatar, username, timestamp, title, image, content } = post;
    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeScale] = useState(new Animated.Value(1));

    useEffect(() => {
        // console.log( post);
    }, []);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this post by ${username}: ${title}`,
                url: image, // You can share image URL if available
            });
        } catch (error) {
            console.error('Error sharing post:', error.message);
        }
    };

    const handleAddComment = () => {
        if (commentInput.trim() !== '') {
            const newComment = {
                id: comments.length + 1,
                username: 'Anonymous', // You can set the username dynamically
                content: commentInput,
            };
            setComments([...comments, newComment]);
            setCommentInput('');
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        Animated.sequence([
            Animated.timing(likeScale, {
                toValue: 1.2,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(likeScale, {
                toValue: 1,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={styles.content}>{content}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <FontAwesome name={liked ? 'thumbs-up' : 'thumbs-o-up'} size={20} color={liked ? '#0A8A4F' : '#333'} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="comment" size={20} color="#333" />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <FontAwesome name="share" size={20} color="#333" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder="Add a comment..."
                value={commentInput}
                onChangeText={setCommentInput}
                onSubmitEditing={handleAddComment}
                style={styles.commentInput}
            />
            <View style={styles.commentsContainer}>
                {comments.map(comment => (
                    <View key={comment.id} style={styles.comment}>
                        <Text style={styles.commentUsername}>{comment.username}</Text>
                        <Text>{comment.content}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    commentsContainer: {
        marginTop: 10,
    },
    comment: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    commentUsername: {
        fontWeight: 'bold',
        marginRight: 5,
    },
});

export default Card;
