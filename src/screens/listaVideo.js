// Cibely Cristiny dos Santos

import React, { useState, useEffect } from 'react';
import { Button, Alert, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import s3 from '../../awsConfig';

export default function ListaVideos({navigation}) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const params = { Bucket: 'bucket-storage-senai-03', Prefix: 'videos/' };
            const data = await s3.listObjectsV2(params).promise();

            const filtered = data.Contents.filter(file => file.Size > 0 && file.Key.match(/\.(mp4|mov|webm)$/i));
            const urls = filtered.map(file => ({
                key: file.Key,
                url: `https://bucket-storage-senai-03.s3.amazonaws.com/${file.Key}`,
            }));

            setVideos(urls);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro ao carregar vídeos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    videos.map(vid => (
                        <Video
                            key={vid.key}
                            source={{ uri: vid.url }}
                            useNativeControls
                            resizeMode="contain"
                            style={{ width: '100%', height: 300, marginVertical: 10 }}
                        />
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => navigation.navigate('UploadVideo')}
                activeOpacity={0.7}
            >
                <Text style={[styles.buttonText, { color: 'black' }]}>
                    Voltar para Upload
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    buttonSecondary: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});
