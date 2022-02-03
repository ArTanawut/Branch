package models

import (
	"crypto/tls"
	"net/http"
	"strings"

	"github.com/spf13/viper"
)

var (
	// ClientCertSMS .
	ClientCertSMS *http.Client
)

// GetConfig Get Config
func GetConfig(fileName string, filePath string) (*viper.Viper, error) {
	v := viper.New()
	v.SetConfigName(fileName)
	v.AddConfigPath(filePath)
	v.AutomaticEnv()

	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := v.ReadInConfig()

	if err != nil {
		return nil, err
	}

	return v, nil
}

// InitialCertificateForSMS .
func InitialCertificateForSMS(certPath string) error {

	// certs, err := ioutil.ReadFile(certPathCBS)

	// if err != nil {
	// 	return err
	// }

	// pool := x509.NewCertPool()
	// pool.AppendCertsFromPEM(certs)

	ClientCertSMS = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}

	return nil
}
