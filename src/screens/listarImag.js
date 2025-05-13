// Cibely Cristiny dos Santos

import React, { useState, useEffect } from 'react';
import {
    Button,
    Image,
    Alert,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import s3 from '../../awsConfig';

export default function listarImag({navigation}) {
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const params = {
                Bucket: 'bucket-storage-senai-03',
                Prefix: 'imagens/',
            };

            const data = await s3.listObjectsV2(params).promise();

            const filtered = data.Contents.filter(file => file.Key.match(/\.(jpg|jpeg|png)$/i));
            const urls = filtered.map(file => ({
                key: file.Key,
                url: `https://bucket-storage-senai-03.s3.amazonaws.com/${file.Key}`,
            }));

            setImages(urls);
        } catch (error) {
            console.warn('Erro ao buscar imagens:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.imageContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : (
                    images.map(img => (
                        <Image key={img.key} source={{ uri: img.url }} style={styles.imagem} />
                    ))
                )}

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => navigation.navigate('PaginaPrincipal')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.buttonText, { color: 'black' }]}>
                        Voltar para a página principal
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },

    previewImage: {
        width: 200,
        height: 200,
        marginVertical: 20,
        borderRadius: 10,
    },
    imageContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    imagem: {
        width: 100,
        height: 100,
        marginVertical: 5,
        borderRadius: 8,
    },
    loader: {
        marginVertical: 20,
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