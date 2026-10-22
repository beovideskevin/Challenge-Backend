const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, body) => {
  const retries = 3;
  // Wait 10 seconds and 20 seconds, after 30 seconds the service is down.
  const backoff = [10000, 20000];

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        body,
      });
      const data = await resp.json();
      if (data.success) {
        return data;
      }

      if (attempt + 1 === retries) {
        console.log(`Failed after ${retries} attempts.`);
        return data;
      }

      console.log(
        `Attempt ${attempt} failed. Retrying in ${backoff[attempt]}ms...`,
      );
      await delay(backoff[attempt]);
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = fetchWithRetry;
