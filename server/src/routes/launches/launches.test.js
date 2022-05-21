require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const CONFIG = require('../../../constants/config');
const { mongoConnect, mongoDisconnect } = require('../../utils/mongo');
const { loadPlanetData } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetData();
  });
  
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('GET /launches', () => {
    test('It should response with 200 success', async () => {
      await request(app)
        .get(CONFIG.apiPrefix + CONFIG.version1Path + '/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  });

  describe('POST /launches', () => {
    const launchWithoutDate = {
      mission: 'Test mission',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
    };
    const launch = {
      ...launchWithoutDate,
      launchDate: '2020-01-01',
    };

    test('It should respond with 201 success with correct new record', async () => {
      const response = await request(app)
        .post(CONFIG.apiPrefix + CONFIG.version1Path + '/launches')
        .send(launch)
        .expect(201)
        .expect('Content-Type', /json/);

      const requestDate = new Date(launch.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject({
        ...launchWithoutDate,
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
      });
    });

    test('It should catch missing required fields and respond with 400 error', async () => {
      const response = await request(app)
        .post(CONFIG.apiPrefix + CONFIG.version1Path + '/launches')
        .send(launchWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: {
          message: 'Missing required fields',
        },
      });
    });

    test('It should catch invalid launch date and respond with 400 error', async () => {
      const response = await request(app)
        .post(CONFIG.apiPrefix + CONFIG.version1Path + '/launches')
        .send({
          ...launchWithoutDate,
          launchDate: 'january 1st 2020',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: {
          message: 'Invalid launch date',
        },
      });
    });
  });
});
