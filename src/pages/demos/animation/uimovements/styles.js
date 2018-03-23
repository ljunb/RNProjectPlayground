import { StyleSheet, Dimensions } from 'react-native'

const { width: screenW } = Dimensions.get('window')

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  head: {
    height: 64,
    width: screenW,
    backgroundColor: 'rgb(170,200,198)',
    alignItems: 'center',
  },
  peopleCell: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb'
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 16,
    marginRight: 12,
  },
  activeAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  textWrapper: {
    position: 'absolute',
    top: 70 + 40 * 3 + 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  coverView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgb(170,200,198)',
  },
  spreadCover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  photoItem: {
    height: 100,
    width: 100,
    borderRadius: 6,
    marginRight: 16,
    overflow: 'hidden'
  },
  animatedPhotoItem: {
    height: 100,
    width: 100,
    position: 'absolute',
    shadowOffset: {width: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowRadius: 10
  },
  backBtn: {
    height: 44,
    position: 'absolute',
    top: 20,
    left: 0,
    width: 64,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  }
})