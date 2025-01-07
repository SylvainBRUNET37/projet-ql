  <template>
    <div class="container mt-5">
      <div class="box">
        <h1 class="title has-text-centered">Equipment Details</h1>
        <div class="columns">
          <div class="column is-one-third has-text-centered">
            <figure class="image is-square">
            <img :src="equipment.image ? `/images/${equipment.image}` : '/images/default.png'" alt="Equipment Image" />
            </figure>
          </div>
          <div class="column">
            <div class="content">
              <div class="field">
                <label class="label">Name:</label>
                <p class="control is-size-5">{{ equipment.name }}</p>
              </div>
              <div class="field">
                <label class="label">Reference:</label>
                <p class="control is-size-5">{{ equipment.ref }}</p>
              </div>
              <div class="field">
                <label class="label">Type:</label>
                <p class="control is-size-5">{{ equipment.type }}</p>
              </div>
              <div class="field">
                <label class="label">Status:</label>
                <p class="control is-size-5">{{ equipment.status }}</p>
              </div>
            </div>

            <div class="buttons is-right mt-5">
              <button class="button is-success" @click="borrowEquipment">Borrow</button>
              <button class="button is-danger" @click="goBack">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/firebase';

  export default {
    
    data(){
      return {
        equipment: null,
      };
    },
    async created() {
      const equipmentId = this.$route.params.id;
      const docRef = doc(db, 'equipments', equipmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.equipment = { id: docSnap.id, ...docSnap.data() };
      } else {
        alert('Equipment not found!');
        this.goBack();
      }
    },
    methods: {
      goBack() {
        this.$router.push('/home');
      },
      borrowEquipment() {
        alert(`You borrowed: ${this.equipment.name}`);
        // Logique pour emprunter l'équipement
      },
    },
  };
  </script>

  <style scoped>
  /* Ajuste la taille et le positionnement de l'image */
  .image img {
    max-height: 300px;
    object-fit: cover;
    border-radius: 10px;
  }
  .field .label {
    font-weight: bold;
    color: #4a4a4a;
  }
  </style>
