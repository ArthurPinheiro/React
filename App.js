
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import Repo from './components/Repo';
import NewRepoModal from './components/NewRepoModal';

export default class App extends Component {

  state = {

    modalVisible: false,

    repos: [
      {
        id: 1,
        thumbnail: 'https://avatars0.githubusercontent.com/u/28929274?s=200&v=4',
        title: 'arthur.com.br',
        author: 'Arthur Pinheiro',
      },
      {
        id: 2,
        thumbnail: 'https://avatars0.githubusercontent.com/u/28929274?s=200&v=4',
        title: 'IFRN - Mobile',
        author: 'Desconhecido',
      },
    ],
  };

 
  async componentDidMount(){
    const repos = JSON.parse(await AsyncStorage.getItem('repositories')) || [];

    this.setState({repos});
  }

  _addRepository = async (newRepoText) => {
    const repoCall = await fetch(`http://api.github.com/repos/${newRepoText}`);
    const response = await repoCall.json();

    const repository = {
      id: response.id,
      thumbnail: response.owner.avatar_url,
      title: response.name,
      author: response.owner.login
    };

    this.setState({
      modalVisible: false,
      repos: [
        ...this.state.repos,
        repository,
      ],
    });

    await AsyncStorage.setItem('repositories', JSON.stringify(this.state.repos));
  };
  
  render() {
    return (
     <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> Repositorios </Text>
      
      <TouchableOpacity onPress={() => this.setState({modalVisible: true}) }>
        <Text style={styles.headerButton}>+</Text>
      </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.repoList}>
        {this.state.repos.map(repo => <Repo key={repo.id} data={repo} />)}
      </ScrollView>

      <NewRepoModal 
        onCancel={() => this.setState({modalVisible: false})}
        onAdd={(newRepoText) =>  this._addRepository(newRepoText)}
        visible={this.state.modalVisible} />

     </View>
    );
  }
}

App.navigationOptions = {
  title: 'Repositórios',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },

  header:{
    height: (Platform.OS === 'ios') ? 70 : 50,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },

  headerButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerText:{
    fontSize: 16,
    fontWeight: 'bold',
  },

  repoList: {
    padding: 20,
  },
});
