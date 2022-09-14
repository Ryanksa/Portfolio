<script>
  import emailIcon from "../assets/email.png";
  import githubIcon from "../assets/github.png";
  import linkedinIcon from "../assets/linkedin.png";
</script>

<div
  class="w-full min-h-full md:w-max m-auto flex flex-col justify-center items-center"
>
  <div class="flex flex-col gap-3">
    <div class="name text-6xl md:text-8xl mb-4">Ryan Lin</div>
    <div class="flex items-center gap-2">
      <img src={emailIcon} alt="" class="w-6 h-6" />
      ryanlin58@gmail.com
    </div>
    <a href="https://github.com/Ryanksa" class="flex items-center gap-2">
      <img src={githubIcon} alt="" class="w-6 h-6" />
      Github
    </a>
    <a
      href="https://linkedin.com/in/hungjenlin"
      class="flex items-center gap-2"
    >
      <img src={linkedinIcon} alt="" class="w-6 h-6" />
      LinkedIn
    </a>
  </div>
</div>

<style>
  a {
    cursor: none;
  }
</style>
