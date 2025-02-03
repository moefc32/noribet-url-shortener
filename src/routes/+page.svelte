<script>
  import { page } from "$app/stores";
  import { toast } from "svoast";
  import isValidEmail from "$lib/isValidEmail";

  import Login from "$lib/component/Login.svelte";
  import Header from "$lib/component/Header.svelte";

  export let data;

  let { contents } = data;

  let login = {
    email: "",
    password: "",
    loading: false,
  };
  let search = {
    keyword: "",
    loading: false,
    results: [],
  };

  async function loginFormAction() {
    try {
      login.loading = true;
      if (!isValidEmail(login.email)) throw new Error();

      const response = await fetch("/api/auth", {
        method: $page.data.is_registered ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) throw new Error();
      window.location.href = "/";
    } catch (e) {
      login.loading = false;

      console.error(e);
      toast.error(
        `${$page.data.is_registered ? "Login" : "Register"} failed, please check all data and try again!`
      );
    }
  }

  async function doLogout() {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      toast.error("Logout failed, please try again!");
    }
  }

  async function reloadURLList() {
    try {
      const response = await fetch(`/api/env`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      contents.all_contents = result.data;
    } catch (e) {
      console.error(e);
    }
  }

  async function doSearch() {
    search.loading = true;

    try {
      const response = await fetch(`/api/env?s=${search.keyword}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      search.results = result.data;
      search.loading = false;
    } catch (e) {
      search.loading = false;

      console.error(e);
    }
  }
</script>

<main></main>
