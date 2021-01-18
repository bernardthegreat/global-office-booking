<template>
  <div class="container">
    <q-page>
      <div class="row" style="padding-top: 25px;">
        <div class="col-12">
          <booking></booking>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import Booking from 'src/components/Booking.vue'
export default {
  components: { Booking },
  name: 'PageIndex'
}
</script>
