<template>
  <div ref="paypalButtons" class="q-mt-md paypal-buttons">
    <q-card>
      <q-card-section align="center" class="bg-primary text-white">
        <div class="text-h5">
          ORDER SUMMARY
        </div>
      </q-card-section>
      <q-card-section>
        <table id="table-order" style="border-collapse:collapse;text-align:center;" width="100%">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Cost / Quantity</th>
              <th>Order Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ orderSummary.name }}</td>
              <td>{{ orderSummary.itemCostQty }}</td>
              <td>{{ orderSummary.orderCost }}</td>
            </tr>
            <tr>
              <td>Tax (5%)</td>
              <td> -- </td>
              <td>{{ orderSummary.taxCost }}</td>
            </tr>
            <tr>
              <td>TOTAL</td>
              <td>--</td>
              <td>{{ orderSummary.totalCost }}</td>
            </tr>
          </tbody>
        </table>
      </q-card-section>
      <q-card-section align="center" id="try">
        <div class="q-mt-md paypal-buttons-gana" id="paypal-button-container"></div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn push color="primary" label="CLOSE" v-close-popup />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
var finalPaymentDetails = []
function executePaypal (summary) {
  // eslint-disable-next-line no-undef
  paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'paypal'
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: `${summary.name} (${summary.bookingDate} | ${summary.bookingTime})`,
          amount: {
            currency_code: 'CAD',
            value: summary.totalCost.replace('$', ''),
            breakdown: {
              item_total: {
                currency_code: 'CAD',
                value: summary.orderCost.replace('$', '')
              },
              shipping: {
                currency_code: 'CAD',
                value: 0
              },
              tax_total: {
                currency_code: 'CAD',
                value: summary.taxCost.replace('$', '')
              }
            }
          },
          items: [{
            name: summary.name + ' (' + (summary.durationInMinutes) + ' hour/s)',
            unit_amount: {
              currency_code: 'CAD',
              value: summary.orderCost.replace('$', '')
            },
            quantity: 1
          }]
        }]
      })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(async function (details) {
        const splittedBookingTime = summary.bookingTime.split(' - ')
        var paymentDetails = {
          name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
          emailAddress: details.payer.email_address,
          bookingDate: summary.bookingDate,
          bookFrom: splittedBookingTime[0],
          bookTo: splittedBookingTime[1]
        }
        finalPaymentDetails.push(paymentDetails)
      })
    },
    onError: function (err) {
      console.log('Payment Failed')
      console.log(err)
    }
  }).render('#paypal-button-container')
}

import { mapGetters } from 'vuex'
export default {
  props: ['paypalDialog'],
  data () {
    return {
      paymentSuccess: false,
      paymentStatus: '',
      paymentDetails: finalPaymentDetails
    }
  },
  mounted () {
    // this.$store.dispatch('getHourlyBookings', this.date)
    // eslint-disable-next-line no-undef
    if (this.paypalDialog) {
      executePaypal(this.orderSummary)
    }
  },
  computed: {
    ...mapGetters([
      'orderSummary',
      'paymentStatusSuccess'
    ])
  },
  watch: {
    async paymentDetails (val) {
      if (val.length > 0) {
        await this.$store.dispatch('processPayment', val[0])
      }
    },
    paymentStatusSuccess (val) {
      if (val) {
        this.$router.push('thank-you')
      }
    }
  }
}
</script>

<style>
  #table-order tr td {
    padding: 5px;
    border:1px solid rgba(0, 0, 0, 0.12);
  }

  #table-order tr th {
    padding: 10px;
    border:1px solid rgba(0, 0, 0, 0.12);
  }
</style>
