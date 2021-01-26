<template>
    <form @submit.prevent="onSubmit">
        <div class="well pb-4">
            <div class="row">
                <div class="col-sm-12">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Знайти продукт..."
                            v-model="request"
                        />
                        <span class="input-group-btn">
                        <button class="btn btn-primary" type="submit">
                            <i class="fa fa-search"></i>
                        </button>
                        </span>
                    </div>
                </div>
                <div class="col-sm-12 mt-2 text-center">
                    <button class="btn btn-warning" @click="resetSearch">
                    Скинути
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'Search',
    data () {
        return {
            request: ''
        }
    },
    methods: {
        onSubmit() {
            if(this.request.trim()) {
                this.$emit('search', this.request);
            }
        },
        resetSearch() {
            this.request = '';
            this.$emit('resetSearch');
        }
    }
}
</script>

<style scoped>
</style>

