describe('Models: Repository', function() {
  it('latest sorts repositories by their lastBuildStartedAt attribute', function() {
    var latest = Travis.Repository.latest();
    var repository = Travis.Repository.find(1);

    withinRunLoop(function() {
      expect(latest.getEach('id').toArray()).toEqual([1, 2]);
    });
    withinRunLoop(function() {
      repository.set('lastBuildFinishedAt', '2011-05-10T02:20:00Z');
    });
    withinRunLoop(function() {
      expect(latest.getEach('id').toArray()).toEqual([2, 1]);
    });
  });

  it('find returns the repository with the given id', function() {
    var repository = Travis.Repository.find(2);
    expect(repository.get('slug')).toEqual('josevalim/enginex');
  });

  it('latest returns the latest repositories order by their last build', function() {
    var repositories = Travis.Repository.latest();
    expect(repositories.getEach('slug')).toEqual(['svenfuchs/minimal', 'josevalim/enginex']);
  });

  it("given a conditions hash all returns an array containing the repository with the given slug", function() {
    var repositories = Travis.Repository.all({ slug: 'josevalim/enginex' });
    expect(repositories.getEach('slug')).toEqual(['josevalim/enginex']);
  });

  it("builds returns the repository's builds, not including child builds", function() {
    var builds = Travis.Repository.find(2).get('builds');
    expect(builds.getEach('number').sort()).toEqual(['1', '2']); // TODO shouldn't need to sort here
  });

  it('updates the builds collection when a new build iss added', function() {
    var repository = Travis.Repository.find(1);

    withinRunLoop(function() {
      Travis.store.loadRecord(Travis.Build, {
        repository_id: repository.get('id'),
        number: '5',
        started_at: '2011-05-13T00:00:00Z'
      });
    });

    expect(repository.get('builds').getEach('number')).toEqual(['5', '2', '1'])
  });
});