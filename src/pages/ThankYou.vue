<template>
  <div class="flex flex-center q-ma-lg">
    <q-card align="center">
      <q-card-section class="bg-primary">
        <div class="text-h3 text-white"> Global Office </div>
      </q-card-section>
      <q-card-section>
        <div class="text-h2">
          Thank you very much !
        </div>
      </q-card-section>
      <q-card-section class="text-h5">
        We have received your payment!
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="text-h5">
        Please reach out to us at (604) 533-3146 or email us at info@global-office.ac to get you set up and ready to go.
      </q-card-section>
      <q-card-section class='text-bold text-h5'>
        Welcome to the Global family!
      </q-card-section>
      <q-card-actions align="center">
        <a :href="this.url" style="text-decoration: none;">
          <q-btn push color="primary">
              CONTINUE TO HOMEPAGE
          </q-btn>
        </a>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: process.env.API_URL
    }
  }
}
</script>
