import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FormattedMessage } from "react-intl";

function Info({ route }) {
    const { tipoInformacion } = route.params;

    return (
        <View style={styles.container}>
            {tipoInformacion === "cookies" ? (
                <View>
                    <Text style={styles.title}><FormattedMessage id="tab_account_usageCookies" /></Text>
                    <Text style={styles.text}><FormattedMessage id="tab_account_experience" /></Text>
                    <Text style={styles.list}>1. <FormattedMessage id="tab_account_language" />.</Text>
                    <Text style={styles.list}>2. <FormattedMessage id="tab_account_monitor" />.</Text>
                    <Text style={styles.list}>3. <FormattedMessage id="tab_account_analyze" />.</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.title}><FormattedMessage id="tab_account_commitment" /></Text>
                    <Text style={styles.text}><FormattedMessage id="tab_account_encrypt" /></Text>
                    <Text style={styles.list}>1. <FormattedMessage id="tab_account_sensible" /></Text>
                    <Text style={styles.list}>2. <FormattedMessage id="tab_account_authorized" /></Text>
                    <Text style={styles.list}>3. <FormattedMessage id="tab_account_server" /></Text>
                    <Text style={styles.list}>4. <FormattedMessage id="tab_account_password" /></Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    text: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
        lineHeight: 22,
    },
    bold: {
        fontWeight: "bold",
    },
    list: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
        marginLeft: 10,
        lineHeight: 22,
    },
});

export default Info;
