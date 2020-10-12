const { RESTDataSource } = require('apollo-datasource-rest');

class AgentAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:8080/v1/';
  }

  willSendRequest(request) {
    // TODO: fetch it from request headers when live
    request.headers.set('X-Optimizely-SDK-Key', '');
  }

  async getConfig() {
    const response = await this.get(`config`);
    return response?.revision
  }

  async activate({ userId, experimentKey }) {
    const response = await this.post(`activate?experimentKey=${experimentKey}`, {
      userId
    });
    // TODO can there be more experiments activated with one key? If yes refactor response
    return response[0].variationKey
  }

  async getEnabledFeatures({ userId }) {
    const response = await this.post(`activate?type=feature`, {
      userId
    });
    const enabledFeatures = response.reduce((acc, cur) => {
      acc.push(cur.featureKey)
      return acc
    }, [])
    return enabledFeatures
  }

  async isFeatureEnabled({ userId, featureKey }) {
    const response = await this.post(`activate?featureKey=${featureKey}`, {
      userId
    });
    // TODO can there be more feature activated with one key? If yes refactor response
    return response[0].enabled
  }

  async setForcedVariation({ userId, experimentKey, variationKey }) {
    const response = await this.post(`override`, {
      userId,
      experimentKey,
      variationKey
    });
    return response?.variationKey === variationKey ? true : false
  }
}

module.exports = AgentAPI;