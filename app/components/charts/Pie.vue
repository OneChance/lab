<script>
import {Pie, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

export default {
    extends: Pie,
    mixins: [reactiveProp],
    name: "Pie",
    props: ['options'],
    mounted() {
        this.renderChart(this.chartData, this.options)
    }
}
</script>

<style scoped>

</style>