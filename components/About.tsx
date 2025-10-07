const About = () => {
  return (
    <div class="py-4">
      <h3>About</h3>
      <p>
        A way to encode vanity names within public keys. Plus an additional fingerprint encoded with emoji characters. Allowing for unique names, where duplicates (conflicting name + fingerprint pairs) will be exponentialy hard to find (brute force).
      </p>
      <p class="href-wrap">
        <a href="https://github.com/mikeobank/vanice/blob/main/vanice.md">https://github.com/mikeobank/vanice/blob/main/vanice.md</a>
      </p>
    </div>
  )
}

export default About