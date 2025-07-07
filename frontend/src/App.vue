<template>
  <v-app>
    <v-card>
      <v-layout>
        
        <v-navigation-drawer
          expand-on-hover
          rail
          color="#E1DCC5" 
        >
        <v-list>
          <v-list-item
            prepend-avatar="https://static.vecteezy.com/system/resources/thumbnails/019/900/152/small_2x/old-book-watercolor-illustration-png.png " 
            title="LibraMax"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>


         
          <v-list dense nav>
            <v-list-item
              v-for="(link, index) in navLinks"
              :key="index"
              :to="link.to"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

       
        <v-main>
          <v-container>
          
            <v-app-bar app color="#E1DCC5">
              <v-spacer></v-spacer>
            
              <v-divider v-show="showLine"></v-divider>
            </v-app-bar>

           
            <router-view/>
          </v-container>
        </v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navLinks: [
        { title: 'Authors', to: '/' },
        { title: 'Categories', to: '/categories' },
        { title: 'Books', to: '/books' },
        { title: 'Loans', to: '/loans' },
        { title: 'Publishers', to: '/publishers' },
        { title: 'Users', to: '/users' }
      ],
      showLine: false
    };
  },
  methods: {
    toggleMenu() {
      
      this.showLine = !this.showLine;
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Calibri', sans-serif;
}

.main {
  display: flex;
  align-items: center;
  height: 64px;
  justify-content: end;
  position: relative;
}
</style>
