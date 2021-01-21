<template>
    <div class="loader-wrapper">
        <div class="loader"></div>
    </div>
</template>

<script>
export default {
    name: "Loader",
}
</script>

<style scoped>
.loader {
    overflow: hidden;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}

.loader-wrapper {
    width: 100%;
    height: 100%;
    background: white;
    position: fixed;
    z-index: 9999;
    margin: 0;
    padding: 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>