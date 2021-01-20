<template>
  <q-layout view="lHh Lpr lFf">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    <!-- <q-header elevated class="header-border-top bg-white">
      <div class="container">
        <q-toolbar style="padding-top: 10px; margin">
          <q-toolbar-title style="width:260px">
            <img
              alt="Global Office logo"
              src="~assets/global-office-logo.png"
              style="width: 250px;"
            >
          </q-toolbar-title>
          <div class="nav-links">
            <a :href="link.link"
              v-for="link in essentialLinks"
              :key="link.title"
              v-bind="link"
              class="nav-item"
            >
              {{ link.title }}
            </a>
          </div>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </q-toolbar>
      </div>
    </q-header> -->

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue'
const linksData = [
  {
    title: 'HOME',
    link: 'http://global-office.ca/'
  },
  {
    title: 'PACKAGE OFFICE',
    link: 'http://global-office.ca/package-office'
  },
  {
    title: 'VIRTUAL OFFICE',
    link: 'http://global-office.ca/virtual-office'
  },
  {
    title: 'HOURLY RENTALS',
    link: 'http://global-office.ca/hourly-rentals'
  },
  {
    title: 'WHY US',
    link: 'http://global-office.ca/why-us'
  },
  {
    title: 'CONTACT US',
    link: 'http://global-office.ca/contact-us'
  }
]

export default {
  name: 'MainLayout',
  // components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  }
}
</script>

<style>
  .header-border-top {
    border-top-width: 5px;
    border-top-style: solid;
    border-top-color: #49654c;
  }
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 768px) {
    .container {
        max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .container {
        max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    .container {
        max-width: 1140px;
    }
  }

  .nav-links {
    width: 859px;
    margin-left: -65px;
    padding-left: 75px;
  }
  .nav-item {
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    display: inline-block;
    padding: 10px;
    margin: 5px;
    text-decoration: none;
    color: #49654c;

     /* Set up the hover */
  /* If you aren't using autoprefix, remember to prefix the gradient for other browsers */
    background-image: linear-gradient(#49654c, #49654c);
    background-size: 0 2px, auto;
    background-repeat: no-repeat;
    background-position: center bottom;
    transition: all .2s ease-out;
  }
  .nav-item:hover {
    /* The following line makes the underline only as wide as the text */
    /* background-size: calc(100% - 2em) 5px, auto; */
    background-size: 100% 2px, 2px;
  }
</style>
