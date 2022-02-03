package models

import (
	openssl "github.com/Luzifer/go-openssl"
)

// AESEncrypt CRYPTO-JS-AES-256-CBC-PKCS7
func AESEncrypt(text string, key string) (string, error) {

	o := openssl.New()

	e, err := o.EncryptBytes(key, []byte(text))

	if err != nil {
		return "", err
	}

	return string(e), nil
}

// AESDecrypt CRYPTO-JS-AES-256-CBC-PKCS7
func AESDecrypt(text string, key string) (string, error) {

	o := openssl.New()

	d, err := o.DecryptBytes(key, []byte(text))

	if err != nil {
		return "", err
	}

	return string(d), nil
}
