import React from "react";
import { Page, Text, Image, Document, StyleSheet, View } from "@react-pdf/renderer";
import Logo from "./manami_logo.png";

const styles = StyleSheet.create({
  body: {
    paddingVertical: 30,
    paddingHorizontal: 45,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  image: {
    width: 125,
  },
  contact: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  address: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  textContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleLeft: {
    fontSize: 24,
    textAlign: "left",
    width: "50%",
  },
  titleCenter: {
    fontSize: 24,
    textAlign: "center",
    width: "25%"
  },
  titleRight: {
    fontSize: 24,
    textAlign: "center",
    width: "25%"
  },
  descriptionLeft: {
    fontSize: 24,
    textAlign: "left",
    width: "50%",
  },
  descriptionCenter: {
    fontSize: 24,
    textAlign: "center",
    width: "25%"
  },
  descriptionRight: {
    fontSize: 24,
    textAlign: "right",
    width: "25%"
  },
});

const PDFFile = ({
  order_number,
  order_date,
  order_list,
  order_delivery_price,
  order_total_price,
}) => {
  const contact = "(+66)-92317-4044, (+855)-78-459-255";
  const lineId = "@manamicafe";
  const mail = "manamicafe56@gmail.com";
  const address =
    "C1-1, C1-2 Ground floor Samaki Meanchey Village, Sangkat O'Chrov, Poipet City, Banteay Meanchey Province";

  const pages = [
    {
      order_number: order_number,
      order_date: order_date,
      order_delivery_price: order_delivery_price,
      order_total_price: order_total_price,
      image: Logo,
      contact: contact,
      lineId: lineId,
      mail: mail,
      address: address,
    },
  ];
  return (
    <Document>
      {pages.map((page, index) => {
        return (
          <Page key={index} style={styles.body}>
            <Text style={styles.header} fixed></Text>
            <View style={styles.imageContainer}>
              <Image style={styles.image} src={page.image} />
            </View>
            <Text style={styles.contact}>Telephone: {page.contact}</Text>
            <Text style={styles.contact}>Line ID: {page.lineId}</Text>
            <Text style={styles.contact}>Mail: {page.mail}</Text>
            <Text style={styles.address}>{page.address}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.descriptionLeft}>{page.order_number}</Text>
              <Text style={{ width: "50%", fontSize: 24, textAlign: "right" }}>
                {page.order_date}
              </Text>
            </View>
            <View style={{ width: "100%", marginTop: 32 }}>
              <View style={styles.textContainer}>
                <Text style={styles.titleLeft}>List</Text>
                <Text style={styles.titleCenter}>Unit</Text>
                <Text style={styles.titleRight}>Price</Text>
              </View>
            </View>
            {order_list?.map((row, index) =>
              row.page_id === 10 ? (
                <View key={index} style={styles.textContainer}>
                  <Text style={styles.descriptionLeft}>Washing {row.title}</Text>
                  <Text style={styles.descriptionCenter}>1</Text>
                  <Text style={styles.descriptionRight}>{row.totalPrice} THB</Text>
                </View>
              ) : row.page_id === 11 ? (
                <View key={index} style={styles.textContainer}>
                  <Text style={styles.descriptionLeft}>
                    Drying {row.title}, {row.default_minutes + row.minutes_add + " Minutes"}
                  </Text>
                  <Text style={styles.descriptionCenter}>1</Text>
                  <Text style={styles.descriptionRight}>{row.totalPrice} THB</Text>
                </View>
              ) : (
                <View key={index} style={styles.textContainer}>
                  <Text style={styles.descriptionLeft}>{row.product_name}</Text>
                  <Text style={styles.descriptionCenter}>{row.quantity}</Text>
                  <Text style={styles.descriptionRight}>{row.product_price * row.quantity} THB</Text>
                </View>
              )
            )}
            <View style={{ width: "100%", marginTop: 32 }}>
              <View>
                <Text style={{ marginVertical: 32, textAlign: "center" }}>
                  --------------------------------------------------
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.titleLeft}>Delivery</Text>
                <Text style={styles.descriptionRight}>{page.order_delivery_price} THB</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.titleLeft}>Total</Text>
                <Text style={styles.descriptionRight}>
                  {page.order_total_price + page.order_delivery_price} THB
                </Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default PDFFile;
